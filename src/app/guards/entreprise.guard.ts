import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

@Injectable({ providedIn: 'root' })
export class EntrepriseGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const user = this.storageService.getUser();
    const roles: string[] = user?.roles || [];
    if (user?.token && roles.includes('ROLE_ENTREPRISE')) {
      return true;
    }
    this.router.navigate(['/connexion']);
    return false;
  }
}
