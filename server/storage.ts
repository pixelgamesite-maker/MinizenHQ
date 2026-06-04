import { supabase } from "./db";

export interface InsertApplication {
  quoteTweet: string;
  xUsername: string;
  evmAddress: string;
  favoriteSlog?: string;
}

export interface Application {
  id: number;
  quoteTweet: string;
  xUsername: string;
  evmAddress: string;
  favoriteSlog: string;
  createdAt: string;
}

export class DatabaseStorage {
  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const { data, error } = await supabase
      .from("applications")
      .insert({
        quote_tweet: insertApp.quoteTweet,
        x_username: insertApp.xUsername,
        evm_address: insertApp.evmAddress,
        favorite_slog: insertApp.favoriteSlog || "Season 1",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Application;
  }

  async getApplicationByAddress(address: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("evm_address", address)
      .single();

    if (error || !data) return null;
    return data as Application;
  }
}

export const storage = new DatabaseStorage();
