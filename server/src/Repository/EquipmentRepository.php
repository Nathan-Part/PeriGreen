<?php

namespace App\Repository;

use App\Entity\Equipment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Equipment>
 */
class EquipmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Equipment::class);
    }

    /**
     * Récupère tous les équipements avec leur catégorie et leurs emprunts
     * pré-chargés en UNE SEULE requête SQL (évite le problème N+1).
     *
     * @return Equipment[]
     */
    public function findAllWithJoins(): array
    {
        return $this->createQueryBuilder('e')
            ->addSelect('c', 'l')
            ->leftJoin('e.category', 'c')
            ->leftJoin('e.loans', 'l')
            ->orderBy('e.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère un équipement par son ID avec sa catégorie et ses emprunts
     * pré-chargés en UNE SEULE requête SQL.
     */
    public function findOneWithJoins(int $id): ?Equipment
    {
        return $this->createQueryBuilder('e')
            ->addSelect('c', 'l')
            ->leftJoin('e.category', 'c')
            ->leftJoin('e.loans', 'l')
            ->where('e.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}

