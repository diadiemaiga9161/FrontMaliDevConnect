import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private keyPair: CryptoKeyPair | null = null;
  private contactKeys: Map<number, CryptoKey> = new Map();
  private readonly DB_NAME = 'devmali-crypto';
  private readonly STORE = 'keypairs';
  private db: IDBDatabase | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  async init(userId: number): Promise<void> {
    try {
      await this.openDB();
      const stored = await this.loadFromDB(userId);
      if (stored) {
        this.keyPair = stored;
      } else {
        this.keyPair = await crypto.subtle.generateKey(
          { name: 'ECDH', namedCurve: 'P-256' },
          true,
          ['deriveKey']
        );
        await this.saveToDB(userId, this.keyPair);
      }
      // Upload public key to server
      const pubJwk = await crypto.subtle.exportKey('jwk', this.keyPair.publicKey);
      const token = this.storageService.getUser()?.token;
      if (token) {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        this.http.put(`${URL_BASE}user/public-key`, { publicKey: JSON.stringify(pubJwk) }, { headers }).subscribe();
      }
    } catch (e) {
      console.warn('CryptoService init error:', e);
    }
  }

  async loadContactPublicKey(userId: number): Promise<void> {
    if (this.contactKeys.has(userId)) return;
    return new Promise(resolve => {
      this.http.get<any>(`${URL_BASE}user/public-key/${userId}`).subscribe({
        next: async (data) => {
          if (data?.publicKey) {
            try {
              const jwk = JSON.parse(data.publicKey);
              const key = await crypto.subtle.importKey(
                'jwk', jwk,
                { name: 'ECDH', namedCurve: 'P-256' },
                false, []
              );
              this.contactKeys.set(userId, key);
            } catch (_) {}
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async encrypt(plaintext: string, recipientUserId: number): Promise<string> {
    if (!this.keyPair) throw new Error('Non initialisé');
    const recipientKey = this.contactKeys.get(recipientUserId);
    if (!recipientKey) throw new Error('Clé publique destinataire manquante');
    const sharedKey = await this.deriveKey(recipientKey, 'encrypt');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sharedKey, encoded);
    const combined = new Uint8Array(12 + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), 12);
    return btoa(String.fromCharCode(...Array.from(combined)));
  }

  async decrypt(ciphertext: string, senderUserId: number): Promise<string> {
    if (!this.keyPair) throw new Error('Non initialisé');
    const senderKey = this.contactKeys.get(senderUserId);
    if (!senderKey) throw new Error('Clé publique expéditeur manquante');
    const sharedKey = await this.deriveKey(senderKey, 'decrypt');
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sharedKey, data);
    return new TextDecoder().decode(decrypted);
  }

  async decryptMessage(message: any, otherUserId: number, myUserId: number): Promise<string> {
    const raw = message.contenu || message.content || '';
    if (!raw) return '';
    try {
      return await this.decrypt(raw, otherUserId);
    } catch {
      // Si le contenu ressemble à un chiffré ECDH (base64 long), afficher un placeholder lisible
      if (raw.length > 40 && /^[A-Za-z0-9+/]+=*$/.test(raw)) {
        return '[Message chiffré - non lisible]';
      }
      return raw;
    }
  }

  isReady(userId: number): boolean {
    return !!this.keyPair && this.contactKeys.has(userId);
  }

  private async deriveKey(otherPublicKey: CryptoKey, usage: 'encrypt' | 'decrypt'): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      { name: 'ECDH', public: otherPublicKey },
      this.keyPair!.privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      [usage]
    );
  }

  private async openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = (e: any) => {
        const db: IDBDatabase = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE, { keyPath: 'userId' });
        }
      };
      req.onsuccess = (e: any) => { this.db = e.target.result; resolve(); };
      req.onerror = () => reject(req.error);
    });
  }

  private async loadFromDB(userId: number): Promise<CryptoKeyPair | null> {
    return new Promise(resolve => {
      if (!this.db) return resolve(null);
      const tx = this.db.transaction(this.STORE, 'readonly');
      const store = tx.objectStore(this.STORE);
      const req = store.get(userId);
      req.onsuccess = () => {
        const record = req.result;
        if (!record) return resolve(null);
        resolve({ publicKey: record.publicKey, privateKey: record.privateKey });
      };
      req.onerror = () => resolve(null);
    });
  }

  private async saveToDB(userId: number, keyPair: CryptoKeyPair): Promise<void> {
    return new Promise(resolve => {
      if (!this.db) return resolve();
      const tx = this.db.transaction(this.STORE, 'readwrite');
      const store = tx.objectStore(this.STORE);
      store.put({
        userId,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
}
