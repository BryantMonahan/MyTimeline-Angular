import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private matSnackBarService = inject(MatSnackBar)

  openSnackbar(message: string, color: "green" | "red", duration: number
  ) {
    this.matSnackBarService.open(message, undefined, {
      duration,
      horizontalPosition: "center",
      panelClass: [`${color}-text-snackbar`]
    })
  }
}
