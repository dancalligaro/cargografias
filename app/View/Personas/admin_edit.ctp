<div class="personas form">
<?php echo $this->Form->create('Persona'); ?>
	<fieldset>
		<legend><?php echo __('Admin Edit Persona'); ?></legend>
	<?php
		echo $this->Form->input('persona_id');
		echo $this->Form->input('nombre');
		echo $this->Form->input('apellido');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit')); ?>
</div>
<div class="actions">
	<h3><?php echo __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Form->postLink(__('Delete'), array('action' => 'delete', $this->Form->value('Persona.persona_id')), null, __('Are you sure you want to delete # %s?', $this->Form->value('Persona.persona_id'))); ?></li>
		<li><?php echo $this->Html->link(__('List Personas'), array('action' => 'index')); ?></li>
		<li><?php echo $this->Html->link(__('List Cargos'), array('controller' => 'cargos', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Cargo'), array('controller' => 'cargos', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Patrimonios'), array('controller' => 'patrimonios', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Patrimonio'), array('controller' => 'patrimonios', 'action' => 'add')); ?> </li>
	</ul>
</div>