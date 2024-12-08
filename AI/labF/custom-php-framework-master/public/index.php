<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    // Obsługa post
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction((int)$_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction((int)$_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction((int)$_REQUEST['id'], $router);
        break;

    // Obsługa dodatki (NOWE)
    case 'dodatki-index':
        $controller = new \App\Controller\DodatkiController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'dodatki-create':
        $controller = new \App\Controller\DodatkiController();
        $view = $controller->createAction($_REQUEST['dodatek'] ?? null, $templating, $router);
        break;
    case 'dodatki-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\DodatkiController();
        $view = $controller->editAction((int)$_REQUEST['id'], $_REQUEST['dodatek'] ?? null, $templating, $router);
        break;
    case 'dodatki-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\DodatkiController();
        $view = $controller->showAction((int)$_REQUEST['id'], $templating, $router);
        break;
    case 'dodatki-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\DodatkiController();
        $view = $controller->deleteAction((int)$_REQUEST['id'], $router);
        break;

    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
