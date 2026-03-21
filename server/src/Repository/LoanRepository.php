<?php

namespace App\Repository;

use App\Entity\Loan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Loan>
 */
class LoanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Loan::class);
    }

    /**
     * Récupère tous les emprunts avec equipment, borrower et reservation
     * pré-chargés en UNE SEULE requête SQL (évite le problème N+1).
     *
     * @return Loan[]
     */
    public function findAllWithJoins(): array
    {
        return $this->createQueryBuilder('l')
            ->addSelect('e', 'b', 'r')
            ->leftJoin('l.equipment', 'e')
            ->leftJoin('l.borrower', 'b')
            ->leftJoin('l.reservation', 'r')
            ->orderBy('l.pickupDate', 'DESC')
            ->getQuery()
            ->getResult();
    }
}

