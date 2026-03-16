<?php

namespace App\Controller;

use App\Entity\Equipment;
use App\Repository\CategoryRepository;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/equipments', name: 'api_equipments_')]
class EquipmentController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EquipmentRepository $repo): JsonResponse
    {
        $equipments = $repo->findAll();
        $data = array_map(fn($e) => $this->format($e), $equipments);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Equipment $equipment): JsonResponse
    {
        return $this->json($this->format($equipment));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, CategoryRepository $categoryRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $required = ['name', 'description', 'brand', 'model', 'serialNumber', 'etat', 'totalQuantity', 'imageUrl', 'categoryId'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => "Champ manquant : $field"], 400);
            }
        }

        $category = $categoryRepo->find($data['categoryId']);
        if (!$category) {
            return $this->json(['error' => 'Catégorie introuvable'], 404);
        }

        $equipment = new Equipment();
        $equipment->setName($data['name']);
        $equipment->setDescription($data['description']);
        $equipment->setBrand($data['brand']);
        $equipment->setModel($data['model']);
        $equipment->setSerialNumber($data['serialNumber']);
        $equipment->setEtat($data['etat']);
        $equipment->setTotalQuantity((int) $data['totalQuantity']);
        $equipment->setImageUrl($data['imageUrl']);
        $equipment->setCategory($category);

        $em->persist($equipment);
        $em->flush();

        return $this->json($this->format($equipment), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Equipment $equipment, Request $request, EntityManagerInterface $em, CategoryRepository $categoryRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name']))          $equipment->setName($data['name']);
        if (isset($data['description']))   $equipment->setDescription($data['description']);
        if (isset($data['brand']))         $equipment->setBrand($data['brand']);
        if (isset($data['model']))         $equipment->setModel($data['model']);
        if (isset($data['serialNumber']))  $equipment->setSerialNumber($data['serialNumber']);
        if (isset($data['etat']))          $equipment->setEtat($data['etat']);
        if (isset($data['totalQuantity'])) $equipment->setTotalQuantity((int) $data['totalQuantity']);
        if (isset($data['imageUrl']))      $equipment->setImageUrl($data['imageUrl']);

        if (isset($data['categoryId'])) {
            $category = $categoryRepo->find($data['categoryId']);
            if (!$category) {
                return $this->json(['error' => 'Catégorie introuvable'], 404);
            }
            $equipment->setCategory($category);
        }

        $em->flush();

        return $this->json($this->format($equipment));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Equipment $equipment, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($equipment);
        $em->flush();

        return $this->json(['message' => 'Équipement supprimé'], 200);
    }

    private function format(Equipment $e): array
    {
        $activeLoans = $e->getLoans()->filter(fn($l) => in_array($l->getStatus()?->value, ['EN_COURS', 'EN_RETARD']));
        $status = $activeLoans->count() > 0 ? 'IN_USE' : 'AVAILABLE';
        
        // Si l'état contient "maintenance", on met le status à MAINTENANCE
        if (str_contains(strtolower($e->getEtat() ?? ''), 'maintenance')) {
            $status = 'MAINTENANCE';
        }

        return [
            'id'            => $e->getId(),
            'name'          => $e->getName(),
            'description'   => $e->getDescription(),
            'brand'         => $e->getBrand(),
            'model'         => $e->getModel(),
            'serialNumber'  => $e->getSerialNumber(),
            'etat'          => $e->getEtat(),
            'condition'     => $e->getEtat(), 
            'status'        => $status,       
            'totalQuantity' => $e->getTotalQuantity(),
            'imageUrl'      => $e->getImageUrl(),
            'category'      => [
                'id'   => $e->getCategory()->getId(),
                'name' => $e->getCategory()->getName(),
            ],
        ];
    }
}