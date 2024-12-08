<?php
/** @var $dodatek ?\App\Model\Dodatki */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="dodatek[name]" value="<?= $dodatek ? $dodatek->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="dodatek[description]"><?= $dodatek ? $dodatek->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
