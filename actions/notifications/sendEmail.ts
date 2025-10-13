'use server';

// Email notification system using Resend (or similar service)
// This is a template - you'll need to configure your email service

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email templates
const EMAIL_TEMPLATES = {
  APPLICATION_RECEIVED: (applicantName: string, propertyTitle: string) => ({
    subject: 'Application Received - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Received</h2>
        <p>Dear ${applicantName},</p>
        <p>We have received your application for <strong>${propertyTitle}</strong>.</p>
        <p>Your application is currently under review. We will contact you within 2-3 business days with an update.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),

  APPLICATION_APPROVED: (applicantName: string, propertyTitle: string) => ({
    subject: 'Application Approved - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Application Approved!</h2>
        <p>Dear ${applicantName},</p>
        <p>Congratulations! Your application for <strong>${propertyTitle}</strong> has been approved.</p>
        <p>Please log in to your account to view the next steps and lease documents.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),

  APPLICATION_REJECTED: (applicantName: string, propertyTitle: string, reason?: string) => ({
    subject: 'Application Update - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Update</h2>
        <p>Dear ${applicantName},</p>
        <p>Thank you for your interest in <strong>${propertyTitle}</strong>.</p>
        <p>Unfortunately, we have decided to move forward with another applicant.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
        <p>We encourage you to continue browsing our available properties.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),

  NEW_MESSAGE: (recipientName: string, senderName: string, propertyTitle?: string) => ({
    subject: 'New Message - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Message</h2>
        <p>Dear ${recipientName},</p>
        <p>You have received a new message from <strong>${senderName}</strong>${propertyTitle ? ` regarding <strong>${propertyTitle}</strong>` : ''}.</p>
        <p>Please log in to your account to view and respond to the message.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),

  PROPERTY_RECOMMENDATION: (renterName: string, propertyCount: number) => ({
    subject: 'New Property Recommendations - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Properties Available</h2>
        <p>Dear ${renterName},</p>
        <p>We found ${propertyCount} new ${propertyCount === 1 ? 'property' : 'properties'} that match your preferences!</p>
        <p>Check them out on our platform and apply today.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),

  AGENT_NEW_APPLICATION: (agentName: string, applicantName: string, propertyTitle: string) => ({
    subject: 'New Application Received - RentMe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Application</h2>
        <p>Dear ${agentName},</p>
        <p>You have received a new application from <strong>${applicantName}</strong> for <strong>${propertyTitle}</strong>.</p>
        <p>Please log in to your agent dashboard to review the application.</p>
        <p>Best regards,<br>The RentMe Team</p>
      </div>
    `,
  }),
};

// Mock email sending function - replace with actual email service
async function sendEmailViaService(email: EmailTemplate): Promise<SendEmailResult> {
  try {
    // TODO: Replace with actual email service (Resend, SendGrid, etc.)
    console.log('Sending email:', {
      to: email.to,
      subject: email.subject,
      html: email.html,
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Email notification functions
export async function sendApplicationReceivedEmail(
  applicantEmail: string,
  applicantName: string,
  propertyTitle: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.APPLICATION_RECEIVED(applicantName, propertyTitle);
  return sendEmailViaService({
    to: applicantEmail,
    ...template,
  });
}

export async function sendApplicationApprovedEmail(
  applicantEmail: string,
  applicantName: string,
  propertyTitle: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.APPLICATION_APPROVED(applicantName, propertyTitle);
  return sendEmailViaService({
    to: applicantEmail,
    ...template,
  });
}

export async function sendApplicationRejectedEmail(
  applicantEmail: string,
  applicantName: string,
  propertyTitle: string,
  reason?: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.APPLICATION_REJECTED(applicantName, propertyTitle, reason);
  return sendEmailViaService({
    to: applicantEmail,
    ...template,
  });
}

export async function sendNewMessageEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  propertyTitle?: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.NEW_MESSAGE(recipientName, senderName, propertyTitle);
  return sendEmailViaService({
    to: recipientEmail,
    ...template,
  });
}

export async function sendPropertyRecommendationEmail(
  renterEmail: string,
  renterName: string,
  propertyCount: number
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.PROPERTY_RECOMMENDATION(renterName, propertyCount);
  return sendEmailViaService({
    to: renterEmail,
    ...template,
  });
}

export async function sendAgentNewApplicationEmail(
  agentEmail: string,
  agentName: string,
  applicantName: string,
  propertyTitle: string
): Promise<SendEmailResult> {
  const template = EMAIL_TEMPLATES.AGENT_NEW_APPLICATION(agentName, applicantName, propertyTitle);
  return sendEmailViaService({
    to: agentEmail,
    ...template,
  });
}