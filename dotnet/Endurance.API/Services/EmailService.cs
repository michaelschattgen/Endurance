﻿using System.Net;
using System.Net.Mail;
using System.Text.Json;
using Endurance.API.Interfaces;
using Endurance.API.Models;
using Endurance.API.Models.Settings;

namespace Endurance.API.Services;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;
    
    public EmailService(SmtpSettings smtpSettings)
    {
        _smtpSettings = smtpSettings;
    }
    
    public Task SendEmail(WatchedClassModel watchedClassModel, ClassInfoModel classInfoModel)
    {
        EmailNotifierSettings? emailNotifierSettings =
            JsonSerializer.Deserialize<EmailNotifierSettings>(watchedClassModel.NotifierSettings.Settings);
        
        using (var client = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port))
        {
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.From),
                Subject = "There's a spot available!",
                Body = $"You're receiving this email because you've created a watcher for a class at Sportcity. We want to let you know that there's a spot available for <b>{classInfoModel.Name}</b> on <b>{classInfoModel.StartDateTime.ToShortDateString()}</b> at <b>{classInfoModel.VenueName}</b>.",
                IsBodyHtml = true
            };
            mailMessage.To.Add(emailNotifierSettings!.Email);

            try
            {
                client.Send(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email. Error: {ex.Message}");
            }
        }

        return Task.CompletedTask;
    }
}