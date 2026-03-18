import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import assistantImg from '@/assets/ai-assistant.png';
import './AIAssistant.css';

type Message = { role: 'user' | 'assistant'; content: string };

const WHATSAPP_NUMBER = '918506095853';
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

const quickActions = [
  'Digital Marketing',
  'Website Development',
  'Google & Meta Ads',
  'SEO & SMO',
  'Branding',
  'WhatsApp Marketing',
  'Book Appointment',
];

const createWhatsAppLink = (message: string) =>
  `${WHATSAPP_BASE}${encodeURIComponent(message)}`;

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const includesAny = (text: string, words: string[]) =>
  words.some((word) => text.includes(word));

const keywordGroups = {
  greeting: [
    'hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'namaskar', 'hola',
    'good morning', 'good evening', 'good afternoon'
  ],



  website: [
    'website', 'web site', 'webpage', 'web page', 'landing page', 'site',
    'web development', 'website development', 'web dev', 'webiste',
    'wesbite', 'website banani', 'website banwani', 'website chahiye',
    'site banani', 'site banwani', 'portfolio website', 'business website',
    'ecommerce website', 'online website'
  ],

  digitalMarketing: [
    'digital marketing', 'marketing', 'marketng', 'digtal marketing',
    'social media', 'social media marketing', 'smm', 'instagram marketing',
    'facebook marketing', 'online marketing', 'promotion', 'promote',
    'business promotion', 'reach', 'engagement', 'followers'
  ],

  ads: [
    'ads', 'ad', 'advertising', 'advertisement', 'google ads', 'meta ads',
    'facebook ads', 'instagram ads', 'paid ads', 'ppc', 'lead ads',
    'campaign', 'campaigns', 'google ad', 'meta ad', 'advertisment',
    'advertisng', 'run ads', 'ads chalani', 'ads chalwani'
  ],

  seo: [
    'seo', 'smo', 'seo smo', 'search engine optimization', 'ranking',
    'rank', 'google ranking', 'organic', 'organic traffic', 'search result',
    'search visibility', 'keyword ranking', 'local seo'
  ],

  branding: [
    'branding', 'brand', 'brand identity', 'logo', 'identity',
    'brand presence', 'brand building', 'professional look', 'rebranding',
    'creative branding', 'visual identity'
  ],

  whatsapp: [
    'whatsapp', 'bulk whatsapp', 'whatsapp marketing', 'bulk marketing',
    'broadcast', 'campaign on whatsapp', 'follow up', 'followup',
    'customer follow up', 'lead follow up', 'whats app', 'watsapp'
  ],

  app: [
    'app', 'application', 'application development', 'mobile app',
    'android app', 'ios app', 'app banani', 'app banwani'
  ],

  creative: [
    'graphic design', 'graphic designing', 'designing', 'graphics',
    'creative', 'creatives', 'poster', 'banner', 'video editing',
    'editing', 'video', 'reel', 'social media post', 'content design'
  ],

  leadGrowth: [
    'lead', 'leads', 'sales', 'growth', 'business growth', 'grow business',
    'customers', 'client chahiye', 'inquiry', 'inquiries', 'conversions',
    'conversion', 'generate leads', 'more sales', 'business badhana'
  ],

  pricing: [
    'price', 'pricing', 'cost', 'charge', 'charges', 'budget',
    'kitna', 'kitne', 'rate', 'quotation', 'quote', 'package', 'packages',
    'fees', 'payment'
  ],

  contact: [
    'contact', 'call', 'phone', 'number', 'mobile', 'email', 'mail',
    'address', 'location', 'office', 'contact us', 'reach you',
    'kaise contact kare', 'kaise baat kare'
  ],

  appointment: [
    'appointment', 'book', 'booking', 'consultation', 'consult', 'meeting',
    'schedule', 'talk', 'speak', 'book call', 'book consultation',
    'appointmnt', 'apointment', 'appoint', 'demo'
  ],

  coaching: [
    'coaching', 'institute', 'academy', 'education', 'school',
    'classes', 'course', 'jee', 'nda', 'cuet', 'tuition'
  ],

  gym: [
    'gym', 'fitness', 'trainer', 'workout', 'health', 'localfit'
  ],

  hospital: [
    'doctor', 'hospital', 'clinic', 'medical', 'healthcare', 'patient'
  ],

  realestate: [
    'real estate', 'property', 'builder', 'broker', 'realty'
  ],
};

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        `Hi there! 👋 I'm **Udaani**, your assistant at **ClickUdaan**.\n\n` +
        `I can help you with:\n` +
        `- Digital Marketing\n` +
        `- Website Development\n` +
        `- Google & Meta Ads\n` +
        `- SEO & SMO\n` +
        `- Branding\n` +
        `- WhatsApp Marketing\n` +
        `- App Development\n` +
        `- Graphic Designing & Video Editing\n\n` +
        `You can ask me in **English, Hindi, or Hinglish**. I’ll do my best to guide you. 🚀`,
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getIndustrySuggestion = (normalized: string) => {
    if (includesAny(normalized, keywordGroups.coaching)) {
      return (
        `For a coaching or education business, the most effective combination is usually:\n` +
        `- Social Media Marketing\n` +
        `- Lead Generation Ads\n` +
        `- Landing Page or Website\n` +
        `- WhatsApp Follow-up System\n\n` +
        `This helps attract students, build trust, and improve inquiries.`
      );
    }

    if (includesAny(normalized, keywordGroups.gym)) {
      return (
        `For a gym or fitness business, strong results usually come from:\n` +
        `- Instagram & Social Media Marketing\n` +
        `- Local Lead Ads\n` +
        `- Offer-based Landing Page\n` +
        `- WhatsApp Follow-up for inquiries\n\n` +
        `This helps increase local visibility and membership leads.`
      );
    }

    if (includesAny(normalized, keywordGroups.hospital)) {
      return (
        `For healthcare businesses, trust and clarity matter most.\n\n` +
        `A good strategy usually includes:\n` +
        `- Professional Website\n` +
        `- SEO & Google Visibility\n` +
        `- Paid Ads for services\n` +
        `- Branding & patient trust creatives`
      );
    }

    if (includesAny(normalized, keywordGroups.realestate)) {
      return (
        `For real estate businesses, lead generation works best with:\n` +
        `- Meta & Google Ads\n` +
        `- Landing Pages\n` +
        `- WhatsApp Follow-up\n` +
        `- Strong visual creatives and branding`
      );
    }

    return '';
  };

  const getReply = (rawText: string): string => {
    const text = normalizeText(rawText);

    if (!text) {
      return `Please type your query, and I’ll help you with ClickUdaan services. 😊`;
    }

    if (includesAny(text, keywordGroups.greeting)) {
      return (
        `Hello! 👋 Welcome to **ClickUdaan**.\n\n` +
        `I can help you with digital growth services like website development, ads, SEO, branding, WhatsApp marketing, and more.\n\n` +
        `Tell me what you want for your business, and I’ll guide you.`
      );
    }

    if (includesAny(text, keywordGroups.contact) && includesAny(text, keywordGroups.appointment)) {
      return (
        `You can connect with ClickUdaan directly for consultation or appointment.\n\n` +
        `**Contact Details:**\n` +
        `- Email: hello@clickudaan.com\n` +
        `- Phone: +91 85060 95853\n` +
        `- Address: Iconic Tower, Sector-63, Noida, UP, India\n\n` +
        `[📲 Book Appointment on WhatsApp](${createWhatsAppLink(
          'Hello ClickUdaan, I want to book an appointment for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.website)) {
      const industry = getIndustrySuggestion(text);
      return (
        `A professional website helps build trust, improve online presence, and generate better inquiries.\n\n` +
        `At **ClickUdaan**, we create modern, clean, and conversion-focused websites for businesses.\n\n` +
        `${industry ? `${industry}\n\n` : ''}` +
        `If you want, I can also help you understand whether you need a **business website** or a **landing page**.\n\n` +
        `[📲 Discuss Website Project](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss website development for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.digitalMarketing)) {
      const industry = getIndustrySuggestion(text);
      return (
        `Digital Marketing helps your business grow through better reach, visibility, engagement, and quality leads.\n\n` +
        `At **ClickUdaan**, we help brands grow with strategy, content direction, audience engagement, and performance-focused execution.\n\n` +
        `${industry ? `${industry}\n\n` : ''}` +
        `[📲 Discuss Digital Marketing](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss digital marketing for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.ads)) {
      return (
        `Google & Meta Ads are one of the fastest ways to reach the right audience and generate qualified leads.\n\n` +
        `ClickUdaan can help you with targeted ads, creative direction, lead funnels, and better ROI-focused campaigns.\n\n` +
        `[📲 Discuss Ads Strategy](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss Google & Meta Ads for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.seo)) {
      return (
        `SEO & SMO help improve your online visibility, search ranking, and long-term digital growth.\n\n` +
        `This is a strong option if you want better discoverability, credibility, and organic reach.\n\n` +
        `[📲 Discuss SEO & SMO](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss SEO & SMO for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.branding)) {
      return (
        `Branding makes your business look more professional, memorable, and trustworthy.\n\n` +
        `At ClickUdaan, branding support can help improve your visual identity, online impression, and brand recall.\n\n` +
        `[📲 Discuss Branding](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss branding for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.whatsapp)) {
      return (
        `WhatsApp Marketing is useful for direct communication, follow-ups, promotions, and lead nurturing.\n\n` +
        `It can help improve response rates and customer conversions when used properly.\n\n` +
        `[📲 Discuss WhatsApp Marketing](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss WhatsApp marketing for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.app)) {
      return (
        `Application Development can help businesses offer better user experience, faster accessibility, and scalable digital services.\n\n` +
        `If you are planning a business app, ClickUdaan can guide you with the right direction.\n\n` +
        `[📲 Discuss App Development](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss application development for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.creative)) {
      return (
        `Creative visuals are important for attracting customers and building trust.\n\n` +
        `ClickUdaan helps with **Graphic Designing** and **Video Editing** to make your brand look more professional and engaging.\n\n` +
        `[📲 Discuss Creative Services](${createWhatsAppLink(
          'Hello ClickUdaan, I want to discuss graphic designing and video editing for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.leadGrowth)) {
      const industry = getIndustrySuggestion(text);
      return (
        `If your goal is **business growth**, we usually recommend a mix of strong branding, targeted ads, website optimization, and lead-focused marketing.\n\n` +
        `${industry ? `${industry}\n\n` : ''}` +
        `ClickUdaan can help you choose the right strategy according to your business type and goals.\n\n` +
        `[📲 Get Growth Strategy](${createWhatsAppLink(
          'Hello ClickUdaan, I want a growth strategy for my business.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.pricing)) {
      return (
        `Pricing depends on the service, project scope, and business requirement.\n\n` +
        `If you tell me which service you want — like website, digital marketing, ads, branding, SEO, or WhatsApp marketing — I can guide you better before you contact the team.\n\n` +
        `[📲 Get Pricing on WhatsApp](${createWhatsAppLink(
          'Hello ClickUdaan, I want pricing details for your services.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.contact)) {
      return (
        `You can contact **ClickUdaan** through:\n\n` +
        `- Email: hello@clickudaan.com\n` +
        `- Phone: +91 85060 95853\n` +
        `- Address: Iconic Tower, Sector-63, Noida, UP, India\n\n` +
        `[📲 Chat on WhatsApp](${createWhatsAppLink(
          'Hello ClickUdaan, I want to connect with your team.'
        )})`
      );
    }

    if (includesAny(text, keywordGroups.appointment)) {
      return (
        `Sure — you can book a consultation with ClickUdaan for your business needs.\n\n` +
        `The team can guide you about the right service, growth strategy, and next steps.\n\n` +
        `[📲 Book Appointment on WhatsApp](${createWhatsAppLink(
          'Hello ClickUdaan, I want to book an appointment for my business.'
        )})`
      );
    }

    const industrySuggestion = getIndustrySuggestion(text);

    return (
      `I can help you with **ClickUdaan** services like:\n` +
      `- Digital Marketing\n` +
      `- Website Development\n` +
      `- Google & Meta Ads\n` +
      `- SEO & SMO\n` +
      `- Branding\n` +
      `- WhatsApp Marketing\n` +
      `- Graphic Designing & Video Editing\n` +
      `- App Development\n\n` +
      `${industrySuggestion ? `${industrySuggestion}\n\n` : ''}` +
      `Tell me what you want for your business — like **more leads, better branding, a website, ads, or consultation** — and I’ll guide you properly.\n\n` +
      `[📲 Talk to ClickUdaan on WhatsApp](${createWhatsAppLink(
        'Hello ClickUdaan, I want to know more about your services for my business.'
      )})`
    );
  };

  const sendMessage = (customText?: string) => {
    const finalText = (customText ?? input).trim();
    if (!finalText) return;

    const userMsg: Message = { role: 'user', content: finalText };
    const assistantMsg: Message = { role: 'assistant', content: getReply(finalText) };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!open && (
        <div className="ai-widget" onClick={() => setOpen(true)}>
          <div className="ai-speech-bubble">May I help you?</div>
          <img src={assistantImg} alt="Udaani AI Assistant" className="ai-avatar" />
          <div className="ai-card">
            <h3 className="ai-name">Udaani</h3>
            <p className="ai-role">Your AI Assistant</p>
            <button
              className="ai-chat-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <span className="ai-chat-icon">💬</span>
              Chat Now
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <img src={assistantImg} alt="Udaani" className="chat-header-avatar" />
            <div>
              <h4 className="chat-header-name">Udaani</h4>
              <span className="chat-header-status">● Online</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-whatsapp-link"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            <div className="chat-quick-actions">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="chat-quick-btn"
                  onClick={() => sendMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;