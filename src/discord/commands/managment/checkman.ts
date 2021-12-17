import { DiscordCommands } from "../../../interfaces";

export const command: DiscordCommands = {
    // Note aliases are optional
    cooldown: 3,
    cooldownResponse: "Woah there buckaroo slow down, you have to wait another {time}",
    description: "Used to check if you have manage server perms!",
    example: ["!checkman"],
    group: "managment",
    modOnly: true,
    name: "checkman",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run: async (client, msg, _args) => {
        return msg.reply("You are a manager with \"Manage Server\" Perms!");

    }
};
