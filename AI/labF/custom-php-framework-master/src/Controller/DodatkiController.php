<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Dodatki;
use App\Service\Router;
use App\Service\Templating;

class DodatkiController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        // Pobranie wszystkich rekordów
        $dodatki = Dodatki::findAll();

        // Renderowanie widoku listy
        $html = $templating->render('dodatki/index.html.php', [
            'dodatki' => $dodatki,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            // Tworzenie nowego obiektu z danych formularza

            $dodatek = Dodatki::fromArray($requestPost);
            // @todo walidacja danych
            $dodatek->save();

            // Po zapisaniu przekierowujemy np. na listę
            $path = $router->generatePath('dodatki-index');
            $router->redirect($path);
            return null;
        } else {
            // Jeśli nie ma danych, wyświetlamy formularz
            $dodatek = new Dodatki();
        }

        $html = $templating->render('dodatki/create.html.php', [
            'dodatek' => $dodatek,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $dodatekId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        // Szukamy konkretnego rekordu po ID
        $dodatek = Dodatki::find($dodatekId);
        if (! $dodatek) {
            throw new NotFoundException("Brak dodatku o id $dodatekId");
        }

        if ($requestPost) {
            // Aktualizujemy dane z formularza
            $dodatek->fill($requestPost);
            // @todo walidacja danych
            $dodatek->save();

            // Przekierowanie po zapisie
            $path = $router->generatePath('dodatki-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('dodatki/edit.html.php', [
            'dodatek' => $dodatek,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $dodatekId, Templating $templating, Router $router): ?string
    {
        $dodatek = Dodatki::find($dodatekId);
        if (! $dodatek) {
            throw new NotFoundException("Brak dodatku o id $dodatekId");
        }

        $html = $templating->render('dodatki/show.html.php', [
            'dodatek' => $dodatek,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $dodatekId, Router $router): ?string
    {
        $dodatek = Dodatki::find($dodatekId);
        if (! $dodatek) {
            throw new NotFoundException("Brak dodatku o id $dodatekId");
        }

        $dodatek->delete();
        $path = $router->generatePath('dodatki-index');
        $router->redirect($path);
        return null;
    }
}
