<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/categories', name: 'api_categories_')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(CategoryRepository $repo): JsonResponse
    {
        $categories = $repo->findAll();
        $data = array_map(fn($c) => [
            'id'          => $c->getId(),
            'name'        => $c->getName(),
            'description' => $c->getDescription(),
        ], $categories);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Category $category): JsonResponse
    {
        return $this->json([
            'id'          => $category->getId(),
            'name'        => $category->getName(),
            'description' => $category->getDescription(),
        ]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['name']) || empty($data['description'])) {
            return $this->json(['error' => 'name et description sont requis'], 400);
        }

        $category = new Category();
        $category->setName($data['name']);
        $category->setDescription($data['description']);

        $em->persist($category);
        $em->flush();

        return $this->json([
            'id'          => $category->getId(),
            'name'        => $category->getName(),
            'description' => $category->getDescription(),
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Category $category, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name']))        $category->setName($data['name']);
        if (isset($data['description'])) $category->setDescription($data['description']);

        $em->flush();

        return $this->json([
            'id'          => $category->getId(),
            'name'        => $category->getName(),
            'description' => $category->getDescription(),
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($category);
        $em->flush();

        return $this->json(['message' => 'Catégorie supprimée'], 200);
    }
}