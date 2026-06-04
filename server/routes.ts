import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /**
   * POST: Create a new application
   * This route receives the form data, saves it to Neon via storage,
   * and optionally sends a notification email via Resend.
   */
  app.post(api.applications.create.path, async (req, res) => {
    try {
      // 1. Validate the incoming data against the shared schema
      const input = api.applications.create.input.parse(req.body);
      
      // 2. Save to Database (Neon)
      const application = await storage.createApplication(input);

      // 3. Email Notification Logic
      if (process.env.RESEND_API_KEY) {
        try {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Slogs <onboarding@resend.dev>',
              to: 'delivered@resend.dev', // Default test email
              subject: 'New Slog Application!',
              html: `
                <div style="font-family: sans-serif; color: #333;">
                  <h2>New Application Received</h2>
                  <p><strong>X Username/Link:</strong> ${application.xUsername}</p>
                  <p><strong>EVM Address:</strong> ${application.evmAddress}</p>
                  <p><strong>Quote Tweet:</strong> ${application.quoteTweet}</p>
                  <hr />
                  <p style="font-size: 12px; color: #666;">Slow and steady wins the WL.</p>
                </div>
              `
            })
          });
          
          if (!resendRes.ok) {
            console.error('Resend API error:', await resendRes.text());
          }
        } catch (e) {
          console.error('Email service failed:', e);
        }
      } else {
        console.log("RESEND_API_KEY not found. Storing application in DB only.");
      }

      // 4. Return the created application record
      res.status(201).json(application);

    } catch (err) {
      // Handle Validation Errors (e.g., invalid EVM address format)
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      console.error("Route Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * GET: Check application status by EVM Address
   * Useful for "Check WL" or "Status" dialogs
   */
  app.get(api.applications.status.path, async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      const application = await storage.getApplicationByAddress(address);
      
      if (!application) {
        return res.status(404).json({ message: "No application found for this address" });
      }

      // Return a simple status flag
      res.status(200).json({ 
        status: "submitted",
        timestamp: application.createdAt 
      });

    } catch (err) {
      console.error("Status Route Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}


