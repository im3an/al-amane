import React, { useState, FormEvent, useEffect, memo } from 'react';
import { Heart, Sheet as Sheep, Users, HandHeart, Phone, Mail, Apple, Stethoscope, BookOpen, Droplets, Menu, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

// Initialize EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_0c1f5z4';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_o877rum';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'GTl-AWnAxGjC-wZxB';

const DonationModal = memo(({ isOpen, onClose, onSubmit, data, onChange }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: { name: string; email: string };
  onChange: (field: string, value: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Faire un don</h2>
        
        <div className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="donor-name" className="block text-sm font-medium text-gray-700 mb-1">
                Votre nom
              </label>
              <input
                id="donor-name"
                type="text"
                required
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="donor-email" className="block text-sm font-medium text-gray-700 mb-1">
                Votre email
              </label>
              <input
                id="donor-email"
                type="email"
                required
                value={data.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Enregistrer mes informations
            </button>
          </form>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Coordonnées bancaires</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-500">Bénéficiaire</p>
                <p className="font-medium">Halima Samih Alkhalfi</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IBAN</p>
                <p className="font-medium">FR76 2823 3000 0133 9453 4514 881</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BIC / SWIFT</p>
                <p className="font-medium">REVOFRP2</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Banque</p>
                <p className="font-medium">Revolut Bank UAB</p>
                <p className="text-sm text-gray-600">10 avenue Kléber, 75116, Paris, France</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Votre don permettra de soutenir nos actions humanitaires :</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Distribution de denrées alimentaires</li>
              <li>Accès aux soins médicaux</li>
              <li>Soutien à l'éducation</li>
              <li>Construction de puits</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              Un reçu fiscal vous sera délivré pour tout don effectué.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

DonationModal.displayName = 'DonationModal';

function App() {
  const handleDonorDataChange = (field: string, value: string) => {
    setDonorData(prev => ({ ...prev, [field]: value }));
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donorData, setDonorData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    setIsSubmitting(true);
    
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'asso-alamane@outlook.com',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        }
      );
      
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(newsletterEmail)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'asso-alamane@outlook.com',
          from_email: newsletterEmail,
          message: 'Inscription à la newsletter',
        }
      );
      toast.success('Inscription à la newsletter réussie !');
      setNewsletterEmail('');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Erreur:', error);
    }
  };

  const handleDonorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(donorData.email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'asso-alamane@outlook.com',
          from_name: donorData.name,
          from_email: donorData.email,
          message: 'Demande de reçu fiscal pour un don',
        }
      );
      toast.success('Vos informations ont été enregistrées. Vous recevrez votre reçu fiscal par email.');
      setDonorData({ name: '', email: '' });
      setIsDonationModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi des informations. Veuillez réessayer.');
      console.error('Erreur:', error);
    }
  };



  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSubmit={handleDonorSubmit}
        data={donorData}
        onChange={handleDonorDataChange}
      />
      {/* Hero Section */}
      <header className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"
            alt="Aide humanitaire"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/70"></div>
        </div>
        
        <nav className="relative z-10 bg-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="ml-3 text-2xl font-bold text-white">Al-Amane</span>
              </div>
              <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
                <a href="#missions" className="text-white hover:text-green-200">Nos Missions</a>
                <a href="#impact" className="text-white hover:text-green-200">Notre Impact</a>
                <a href="#contact" className="text-white hover:text-green-200">Contact</a>
                <button 
                  onClick={() => setIsDonationModalOpen(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
                >
                  Faire un don
                </button>
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a
                    href="#missions"
                    className="block px-3 py-2 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Nos Missions
                  </a>
                  <a
                    href="#impact"
                    className="block px-3 py-2 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notre Impact
                  </a>
                  <a
                    href="#contact"
                    className="block px-3 py-2 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                  <button
                    className="w-full text-left px-3 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDonationModalOpen(true);
                    }}
                  >
                    Faire un don
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100%-80px)] flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Ensemble pour un avenir meilleur</h1>
            <p className="text-xl mb-8">
              Al-Amane s'engage dans plusieurs actions humanitaires pour aider les plus démunis : aide alimentaire, soins médicaux, éducation et accès à l'eau potable.
            </p>
            <button 
              onClick={() => setIsDonationModalOpen(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition-colors"
            >
              Contribuer maintenant
            </button>
          </div>
        </div>
      </header>

      {/* Missions Section */}
      <section id="missions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Nos Missions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Apple className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Aide Alimentaire</h3>
              <p className="text-gray-600">Distribution de denrées alimentaires aux familles dans le besoin tout au long de l'année.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Soins Médicaux</h3>
              <p className="text-gray-600">Accès aux soins médicaux essentiels et aux médicaments pour les plus démunis.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Éducation</h3>
              <p className="text-gray-600">Distribution de fournitures scolaires et soutien à l'éducation des enfants.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Droplets className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Accès à l'Eau</h3>
              <p className="text-gray-600">Construction de puits pour fournir de l'eau potable aux communautés.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sheep className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Aïd al-Adha</h3>
              <p className="text-gray-600">Distribution de moutons aux familles pour célébrer l'Aïd al-Adha.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHeart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Soutien Continu</h3>
              <p className="text-gray-600">Accompagnement et soutien régulier aux familles dans le besoin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Notre Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Familles aidées</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">Puits construits</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">750+</div>
              <div className="text-gray-600">Kits scolaires</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">10</div>
              <div className="text-gray-600">Régions couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Contactez-nous</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-8">
                <Phone className="w-6 h-6 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-gray-600">+33 6 77 53 60 54</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">asso-alamane@outlook.com</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div>
                <textarea
                  placeholder="Votre message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-50"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Al-Amane</h3>
              <p className="text-green-200">Ensemble pour un avenir meilleur</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="#missions" className="text-green-200 hover:text-white">Nos Missions</a></li>
                <li><a href="#impact" className="text-green-200 hover:text-white">Notre Impact</a></li>
                <li><a href="#contact" className="text-green-200 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-2 rounded-l-lg w-full text-gray-900"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-200">
            <p>&copy; 2024 Al-Amane. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;