<?php
namespace App\Enum;

enum StatutReservation: string {
    case EN_ATTENTE = 'EN_ATTENTE';
    case VALIDEE    = 'VALIDEE';
    case REFUSEE    = 'REFUSEE';
    case ANNULEE    = 'ANNULEE';
    case EXPIREE    = 'EXPIREE';
}
