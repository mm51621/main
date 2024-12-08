<?php
namespace App\Model;

use App\Service\Config;

class Dodatki
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;
    private ?string $created_at = null; // możesz trzymać to jako string lub DateTime w zależności od potrzeb

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Dodatki
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Dodatki
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Dodatki
    {
        $this->description = $description;
        return $this;
    }

    public function getCreatedAt(): ?string
    {
        return $this->created_at;
    }

    public function setCreatedAt(?string $created_at): Dodatki
    {
        $this->created_at = $created_at;
        return $this;
    }

    public static function fromArray($array): Dodatki
    {
        $dodatek = new self();
        $dodatek->fill($array);

        return $dodatek;
    }

    public function fill($array): Dodatki
    {
        // Jeśli jest id i obiekt nie ma jeszcze id, to ustawiamy je (np. przy wczytywaniu z bazy)
        if (isset($array['id']) && !$this->getId()) {
            $this->setId((int)$array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['created_at'])) {
            $this->setCreatedAt($array['created_at']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM dodatki ORDER BY created_at DESC';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $dodatki = [];
        $dodatkiArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($dodatkiArray as $dodatekArray) {
            $dodatki[] = self::fromArray($dodatekArray);
        }

        return $dodatki;
    }

    public static function find($id): ?Dodatki
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM dodatki WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $dodatekArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$dodatekArray) {
            return null;
        }
        $dodatek = Dodatki::fromArray($dodatekArray);

        return $dodatek;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            // Wstawienie nowego rekordu
            $sql = "INSERT INTO dodatki (name, description) VALUES (:name, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            // Aktualizacja istniejącego rekordu
            $sql = "UPDATE dodatki SET name = :name, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        if (!$this->getId()) {
            return;
        }

        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM dodatki WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        // Resetowanie właściwości po usunięciu
        $this->setId(null);
        $this->setName(null);
        $this->setDescription(null);
        $this->setCreatedAt(null);
    }
}
