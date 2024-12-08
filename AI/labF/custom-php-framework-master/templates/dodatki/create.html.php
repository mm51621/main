<?php
/** @var \App\Model\Dodatki $dodatek */
/** @var \App\Service\Router $router */

$title = 'Create Dodatek';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Dodatek</h1>
    <form action="<?= $router->generatePath('dodatki-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="dodatki-create">
    </form>

    <a href="<?= $router->generatePath('dodatki-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
