<?php
/** @var \App\Model\Dodatki $dodatek */
/** @var \App\Service\Router $router */

$title = "{$dodatek->getName()} ({$dodatek->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= htmlspecialchars($dodatek->getName()) ?></h1>
    <article>
        <?= nl2br(htmlspecialchars($dodatek->getDescription())); ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('dodatki-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('dodatki-edit', ['id' => $dodatek->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
