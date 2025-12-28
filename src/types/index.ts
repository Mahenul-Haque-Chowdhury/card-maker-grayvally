export interface CardData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  github: string;
  tagline: string;
  logo?: string;
  qrValue?: string;
  qrImage?: string;
}

export type TemplateId =
  // Minimal (10) - Clean, whitespace-focused designs
  | 'whisper'
  | 'breath'
  | 'mist'
  | 'silence'
  | 'void-white'
  | 'paper-thin'
  | 'ghost'
  | 'blank-slate'
  | 'quiet'
  | 'hush'
  // Corporate (10) - Professional, trustworthy designs
  | 'boardroom'
  | 'handshake'
  | 'cornerstone'
  | 'summit'
  | 'sterling'
  | 'chairman'
  | 'covenant'
  | 'granite'
  | 'milestone'
  | 'benchmark'
  // Tech / Startup (10) - Modern, innovative designs
  | 'launchpad'
  | 'hyperloop'
  | 'blockchain'
  | 'satellite'
  | 'terraform'
  | 'kubernetes'
  | 'webhook'
  | 'serverless'
  | 'algorithm'
  | 'datastream'
  // Creative (10) - Artistic, expressive designs
  | 'brushstroke'
  | 'collage'
  | 'origami'
  | 'kaleidoscope'
  | 'watercolor'
  | 'mosaic'
  | 'graffiti'
  | 'sculpture'
  | 'gallery'
  | 'atelier'
  // Luxury (10) - Premium, sophisticated designs
  | 'champagne'
  | 'caviar'
  | 'cashmere'
  | 'mahogany'
  | 'venetian'
  | 'versailles'
  | 'monaco'
  | 'dynasty'
  | 'heritage'
  | 'sovereign'
  // Dark Mode (10) - Elegant dark designs
  | 'obsidian'
  | 'charcoal'
  | 'raven'
  | 'onyx-night'
  | 'phantom'
  | 'umbra'
  | 'blackout'
  | 'shadows'
  | 'abyss'
  | 'eclipse-dark'
  // Gradient (10) - Vibrant, flowing designs
  | 'sunrise'
  | 'nebula'
  | 'prism'
  | 'borealis'
  | 'spectrum'
  | 'chromatic'
  | 'iridescent'
  | 'holograph'
  | 'dreamscape'
  | 'mirage'
  // Glassmorphism (10) - Frosted, translucent designs
  | 'frosted'
  | 'crystal-clear'
  | 'dewdrop'
  | 'glacier'
  | 'icesheet'
  | 'translucent'
  | 'haze'
  | 'blur-glass'
  | 'window'
  | 'lucid'
  // Editorial (10) - Magazine, publication designs
  | 'headline'
  | 'byline'
  | 'frontpage'
  | 'manuscript'
  | 'gazette'
  | 'chronicle'
  | 'tribune'
  | 'dispatch'
  | 'periodical'
  | 'journal'
  // Bold Typography (10) - Strong, impactful designs
  | 'shout'
  | 'thunder'
  | 'impact'
  | 'brutalist'
  | 'billboard'
  | 'monument'
  | 'colossus'
  | 'titan'
  | 'mammoth'
  | 'earthquake';

export type FontPairing = 
  // Sans-Serif
  | 'geist'
  | 'inter'
  | 'roboto'
  | 'open-sans'
  | 'lato'
  | 'montserrat'
  | 'poppins'
  | 'nunito'
  | 'raleway'
  | 'ubuntu'
  | 'work-sans'
  | 'dm-sans'
  // Serif
  | 'times-new-roman'
  | 'georgia'
  | 'playfair'
  | 'merriweather'
  | 'lora'
  | 'crimson'
  | 'source-serif'
  // Monospace
  | 'jetbrains-mono'
  | 'fira-code'
  | 'source-code'
  // Display
  | 'oswald'
  | 'bebas'
  | 'archivo-black';

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export type BackgroundStyle = 'solid' | 'gradient' | 'abstract' | 'geometric' | 'noise' | 'glass' | 'preset' | 'image';

export type BackgroundVariant = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6';

// 250 unique background presets
export type BackgroundPreset = string; // Allow any preset ID for flexibility with 250+ presets

export type CardSide = 'front' | 'back';

export interface ContactVisibility {
  email: boolean;
  phone: boolean;
  mobile: boolean;
  fax: boolean;
  website: boolean;
  address: boolean;
  facebook: boolean;
  twitter: boolean;
  linkedin: boolean;
  instagram: boolean;
  youtube: boolean;
  github: boolean;
}

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: FontPairing;
  orientation: 'horizontal' | 'vertical';
  borderRadius: number;
  iconStyle: 'line' | 'solid' | 'minimal' | 'bold';
  template: TemplateId;
  showBleed: boolean;

  padding: number;
  spacing: number;

  backgroundStyle: BackgroundStyle;
  backgroundIntensity: number;
  backgroundVariant: BackgroundVariant;
  backgroundPreset: BackgroundPreset;
  backgroundImage?: string;
  backgroundColor: string;
  glassBlur: number;

  logoPosition: LogoPosition;
  contactVisibility: ContactVisibility;

  showSafeMargins: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  showQr: boolean;

  // Back side settings
  backBackgroundStyle: BackgroundStyle;
  backBackgroundPreset: BackgroundPreset;
  backBackgroundImage?: string;
  backBackgroundColor: string;
  backBackgroundIntensity: number;
  backBackgroundVariant: BackgroundVariant;
}

export interface BusinessCardState {
  data: CardData;
  design: DesignSettings;
}
