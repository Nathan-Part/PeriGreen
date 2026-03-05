<?php

namespace App\Enum;


enum EtatMateriel: string
{
    case NEUF          = 'NEUF';
    case BON_ETAT      = 'BON_ETAT';
    case USE           = 'USE';
    case EN_REPARATION = 'EN_REPARATION';
    case HORS_SERVICE  = 'HORS_SERVICE';
}
