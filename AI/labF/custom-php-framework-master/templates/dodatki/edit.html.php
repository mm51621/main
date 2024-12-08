<?php
/** @var \App\Model\Dodatki $dodatek */
/** @var \App\Service\Router $router */

$title = "Edit Dodatek {$dodatek->getName()} ({$dodatek->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('dodatki-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="dodatki-edit">
        <input type="hidden" name="id" value="<?= $dodatek->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('dodatki-index') ?>">Back to list</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('dodatki-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="dodatki-delete">
                <input type="hidden" name="id" value="<?= $dodatek->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
