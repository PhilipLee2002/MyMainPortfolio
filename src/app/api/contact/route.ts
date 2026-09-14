import { NextRequest, NextResponse } from 'next/server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!contactEmail) {
    console.warn('[portfolio] CONTACT_EMAIL is not set — contact form disabled');
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 503 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length > 2000) {
    return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  }

  try {
    // Using Resend — swap for nodemailer if preferred
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: contactEmail,
      subject: `Portfolio contact from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[portfolio] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
