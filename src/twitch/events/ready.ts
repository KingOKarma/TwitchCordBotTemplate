import { TwitchEvents } from "../../interfaces";

export const event: TwitchEvents = {
    name: "ready",
    run: (client) => {

        console.log("Twitch Commands:", [...client.twitchCommands.values()].map((v) => `[${v.group}] ${v.name} - ${v.description}`), "\n");

    }
};
