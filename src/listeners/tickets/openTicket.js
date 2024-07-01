const { Listener, Events } = require('@sapphire/framework');
const { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
require('dotenv').config();

class InteractionCreate extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.InteractionCreate
      });
   }

   /**
    * 
    * @param {CommandInteraction} interaction 
    */
   async run(interaction) {
      if (interaction.isButton()) {
         if (interaction.customId == 'openButton') {
            const openModal = new ModalBuilder({
               custom_id: 'openModal',
               title: 'Tickets - Heaven',
            })

            const reasonInput = new TextInputBuilder({
               custom_id: 'reasonInput',
               label: 'Inscrivez la raison de votre ticket',
               placeholder: 'Recrutement / Problème avec un membre / Autre',
               min_length: 3,
               max_length: 500,
               required: true,
               style: TextInputStyle.Paragraph
            })

            const row = new ActionRowBuilder().addComponents(reasonInput)
            openModal.addComponents(row)

            await interaction.showModal(openModal);
         }
      }
   }
}
module.exports = {
   InteractionCreate
};