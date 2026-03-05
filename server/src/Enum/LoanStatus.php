<?php
namespace App\Enum;

enum LoanStatus: string {
    case EN_COURS       = 'EN_COURS';
    case RETOUR_DEMANDE = 'RETOUR_DEMANDE';
    case TERMINE        = 'TERMINE';
    case EN_RETARD      = 'EN_RETARD';
}
