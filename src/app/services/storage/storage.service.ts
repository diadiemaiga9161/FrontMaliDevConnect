// Importation du module Angular nécessaire
import { Injectable } from '@angular/core';

// Clé utilisée pour stocker l'utilisateur dans le sessionStorage
const USER_KEY = 'auth-user';

// Injectable permettant l'injection de dépendances pour ce service dans l'ensemble de l'application
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Méthode pour nettoyer le sessionStorage
  clean(): void {
    window.sessionStorage.clear();
  }

  // Méthode pour sauvegarder les informations de l'utilisateur dans le sessionStorage
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY); // Supprime toute ancienne sauvegarde
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user)); // Sauvegarde l'utilisateur en tant que chaîne JSON
  }

  // Méthode pour récupérer les informations de l'utilisateur depuis le sessionStorage
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user); // Retourne l'objet JavaScript correspondant à la chaîne JSON sauvegardée
    }

    return {}; // Retourne un objet vide s'il n'y a pas d'utilisateur sauvegardé
  }

  // Méthode pour mettre à jour les informations de l'utilisateur dans le sessionStorage
  public setUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Méthode pour vérifier si un utilisateur est connecté
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user; // Retourne true si un utilisateur est sauvegardé, sinon false
  }
}
