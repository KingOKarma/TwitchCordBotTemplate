import { dump, load } from "js-yaml";
import { CONFIG } from "./globals";
import { IntentsString } from "discord.js";
import fs from "fs";

/**
 * This represents the config.yml
 * @class Config
 * @property {string} accessToken
 * @property {string} botAccessToken
 * @property {string} botUsername
 * @property {string} clientID
 * @property {string} clientSecret
 * @property {string} environment
 * @property {string} prefix
 * @property {string} twitchUsername
 */
export default class Config {
    private static readonly _configLocation = "./config.yml";
    public readonly botUsername: string;

    public readonly clientId: string;

    public readonly clientSecret: string;

    public readonly discordIntents: IntentsString[];
    public readonly discordPrefix: string;
    public readonly discordToken: string;


    public readonly twitchPrefix: string;

    public readonly twitchUsername: string;


    private constructor() {
        this.botUsername = "";
        this.clientId = "";
        this.clientSecret = "";
        this.discordIntents = ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_PRESENCES", "GUILD_VOICE_STATES", "GUILD_WEBHOOKS"];
        this.discordPrefix = "!";
        this.discordToken = "!";
        this.twitchPrefix = "!";
        this.twitchUsername = "";

    }

    /**
       *  Call getConfig instead of constructor
       */
    public static getConfig(): Config {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!fs.existsSync(Config._configLocation)) {
            throw new Error("Please create a config.yml");
        }
        const fileContents = fs.readFileSync(
            Config._configLocation,
            "utf-8"
        );
        const casted = load(fileContents) as Config;

        return casted;
    }

    /**
   *  Safe the config to the congfig.yml default location
   */
    public static saveConfig(): void {
        fs.writeFileSync(Config._configLocation, dump(CONFIG));
    }
}