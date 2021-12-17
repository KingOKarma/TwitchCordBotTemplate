import { CONFIG, TOKEN } from "../utils/globals";
import { DiscordCommands, DiscordCooldowns, DiscordEvents, TwitchCommands, TwitchCooldowns, TwitchEvents } from "../interfaces";
import { ApiClient } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { Client } from "discord.js";
import { RefreshingAuthProvider } from "@twurple/auth";
import Token from "../utils/token";
import { eventBinder } from "../utils/eventBinder";
import fs from "fs";
import path from "path";

// Config consts
const { clientId } = CONFIG;
const { clientSecret } = CONFIG;

// Auth Consts
export const authProvider = new RefreshingAuthProvider(
    {
        clientId,
        clientSecret,
        onRefresh: (newTokenData): void => {
            TOKEN.tokenData = newTokenData;
            Token.saveConfig();
        }
    },
    TOKEN.tokenData
);

class ExtendedClient extends ChatClient {
    public apiClient = new ApiClient({ authProvider });
    public clientEvent = eventBinder(this);

    public discord = new Client({ "intents": CONFIG.discordIntents });

    public discordAliases: Map<string, DiscordCommands> = new Map();
    public discordCommands: Map<string, DiscordCommands> = new Map();
    public discordCooldowns: Map<string, DiscordCooldowns> = new Map();
    public discordEvents: Map<string, DiscordEvents> = new Map();

    public startedAt = Date.now();

    public twitchAliases: Map<string, TwitchCommands> = new Map();
    public twitchCommands: Map<string, TwitchCommands> = new Map();
    public twitchCooldowns: Map<string, TwitchCooldowns> = new Map();
    public twitchEvents: Map<string, TwitchEvents> = new Map();


    public async initChatClient(): Promise<void> {


        /* TWITCH Commands */
        const tCommandPath = path.join(__dirname, "..", "twitch", "commands");
        console.log(tCommandPath);
        fs.readdirSync(tCommandPath).forEach(async (dir) => {
            const cmds = fs.readdirSync(`${tCommandPath}/${dir}`).filter((file) => file.endsWith(".js"));

            for (const file of cmds) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { command } = await import(`${tCommandPath}/${dir}/${file}`);
                this.twitchCommands.set(command.name, command);

                if (command?.aliases !== undefined) {
                    command.aliases.forEach((alias: string) => {
                        this.twitchAliases.set(alias, command);
                    });
                }
            }
        });

        /* DISCORD Commands */
        const dCommandPath = path.join(__dirname, "..", "discord", "commands");
        console.log(dCommandPath);
        fs.readdirSync(dCommandPath).forEach(async (dir) => {
            const cmds = fs.readdirSync(`${dCommandPath}/${dir}`).filter((file) => file.endsWith(".js"));

            for (const file of cmds) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { command } = await import(`${dCommandPath}/${dir}/${file}`);
                this.discordCommands.set(command.name, command);

                if (command?.aliases !== undefined) {
                    command.aliases.forEach((alias: string) => {
                        this.discordAliases.set(alias, command);
                    });
                }
            }
        });


        await this.connect().then(() => {
            console.log(`Sucessfully connected to Twitch client as ${CONFIG.botUsername}`);
        }).catch(console.error);

        await this.discord.login(CONFIG.discordToken);


        /* TWITCH Events */
        const teventPath = path.join(__dirname, "..", "twitch", "events");
        fs.readdirSync(teventPath).forEach(async (file) => {
            const { event } = await import(`${teventPath}/${file}`);
            console.log(event);
            this.twitchEvents.set(event.name, event);
            this.clientEvent.on(event.name, event.run.bind(null, this));
        });

        /* DISCORD Events */
        const deventPath = path.join(__dirname, "..", "discord", "events");
        fs.readdirSync(deventPath).forEach(async (file) => {
            const { event } = await import(`${deventPath}/${file}`);
            console.log(event);
            this.discordEvents.set(event.name, event);
            this.discord.on(event.name, event.run.bind(null, this));
        });

    }


}

export default ExtendedClient;
