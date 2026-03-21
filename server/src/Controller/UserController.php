<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\Role;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users', name: 'api_users_')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        $data = $this->format($user);

        $response = new JsonResponse($data);
        $response->setEtag(md5(serialize($data)));
        $response->setPrivate();
        $response->isNotModified($request);

        return $response;
    }

    #[Route('/me', name: 'me_update', methods: ['PUT'])]
    public function updateMe(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (isset($data['email'])) {
            $existing = $userRepo->findOneBy(['email' => $data['email']]);
            if ($existing && $existing->getId() !== $user->getId()) {
                return $this->json(['error' => 'Email deja utilise'], 409);
            }
            $user->setEmail($data['email']);
        }

        if (isset($data['fullName'])) {
            $user->setFullName($data['fullName']);
        }

        if (isset($data['universityId'])) {
            $user->setUniversityId($data['universityId']);
        }

        if (!empty($data['password'])) {
            if (empty($data['currentPassword'])) {
                return $this->json(['error' => 'Le mot de passe actuel est requis'], 400);
            }

            if (!$passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                return $this->json(['error' => 'Mot de passe actuel invalide'], 400);
            }

            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        }

        $em->flush();

        return $this->json($this->format($user));
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, UserRepository $repo): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = array_map(fn($u) => $this->format($u), $repo->findAll());

        $response = new JsonResponse($data);
        $response->setEtag(md5(serialize($data)));
        $response->setPrivate(); // Contient des emails et données personnelles
        $response->isNotModified($request);

        return $response;
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Request $request, User $user): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = $this->format($user);

        $response = new JsonResponse($data);
        $response->setEtag(md5(serialize($data)));
        $response->setPrivate();
        $response->isNotModified($request);

        return $response;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        $required = ['email', 'password', 'fullName', 'universityId', 'role'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => "Champ manquant : $field"], 400);
            }
        }

        if ($userRepo->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        $role = Role::tryFrom($data['role']);
        if (!$role) {
            return $this->json(['error' => 'Rôle invalide. Valeurs: ADMIN, USER'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFullName($data['fullName']);
        $user->setUniversityId($data['universityId']);
        $user->setRole($role);
        $user->setRoles($role === Role::ADMIN ? ['ROLE_ADMIN'] : ['ROLE_USER']);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return $this->json($this->format($user), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        User $user,
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $existing = $userRepo->findOneBy(['email' => $data['email']]);
            if ($existing && $existing->getId() !== $user->getId()) {
                return $this->json(['error' => 'Email déjà utilisé'], 409);
            }
            $user->setEmail($data['email']);
        }

        if (isset($data['fullName']))     $user->setFullName($data['fullName']);
        if (isset($data['universityId'])) $user->setUniversityId($data['universityId']);

        if (isset($data['password'])) {
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        }

        if (isset($data['role'])) {
            $role = Role::tryFrom($data['role']);
            if (!$role) return $this->json(['error' => 'Rôle invalide'], 400);
            $user->setRole($role);
            $user->setRoles($role === Role::ADMIN ? ['ROLE_ADMIN'] : ['ROLE_USER']);
        }

        $em->flush();
        return $this->json($this->format($user));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(User $user, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $em->remove($user);
        $em->flush();
        return $this->json(['message' => 'Utilisateur supprimé'], 200);
    }

    private function format(User $u): array
    {
        return [
            'id'           => $u->getId(),
            'email'        => $u->getEmail(),
            'fullName'     => $u->getFullName(),
            'universityId' => $u->getUniversityId(),
            'role'         => $u->getRole(),
            'roles'        => $u->getRoles(),
            'createdAt'    => $u->getCreatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}
