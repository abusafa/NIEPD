import React, { useState, useEffect } from 'react';
import { Building, Users, Award, Target, ChevronDown, ChevronUp, Mail, Phone, Linkedin, Twitter, User, Crown, Shield, Briefcase, GraduationCap, Globe } from 'lucide-react';
import { dataService } from '@/lib/api';

interface OrganizationalStructureProps {
  currentLang: 'ar' | 'en';
}

const OrganizationalStructure: React.FC<OrganizationalStructureProps> = ({ currentLang }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['board', 'management']);
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [organizationData, setOrganizationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const content = {
    ar: {
      title: 'الهيكل التنظيمي',
      subtitle: 'تعرف على القيادات والهيكل الإداري للمعهد الوطني للتطوير المهني التعليمي',
      boardTitle: 'مجلس الإدارة',
      managementTitle: 'الإدارة التنفيذية',
      departmentsTitle: 'الإدارات والأقسام',
      viewProfile: 'عرض الملف الشخصي',
      hideProfile: 'إخفاء الملف الشخصي',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      linkedin: 'لينكد إن',
      twitter: 'تويتر',
      boardMembers: 'أعضاء مجلس الإدارة',
      executiveTeam: 'الفريق التنفيذي',
      departments: 'الإدارات',
      totalMembers: 'إجمالي الأعضاء',
      chairman: 'رئيس مجلس الإدارة',
      member: 'عضو',
      director: 'مدير',
      deputy: 'نائب'
    },
    en: {
      title: 'Organizational Structure',
      subtitle: 'Meet the leadership and administrative structure of the National Institute for Educational Professional Development',
      boardTitle: 'Board of Directors',
      managementTitle: 'Executive Management',
      departmentsTitle: 'Departments & Divisions',
      viewProfile: 'View Profile',
      hideProfile: 'Hide Profile',
      email: 'Email',
      phone: 'Phone',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      boardMembers: 'Board Members',
      executiveTeam: 'Executive Team',
      departments: 'Departments',
      totalMembers: 'Total Members',
      chairman: 'Chairman',
      member: 'Member',
      director: 'Director',
      deputy: 'Deputy'
    }
  };

  const t = content[currentLang];

  // Fetch organizational data
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true);
        const data = await dataService.getOrganizationalStructure();
        setOrganizationData(data);
      } catch (error) {
        console.error('Error fetching organizational structure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  // Show loading state
  if (loading || !organizationData) {
    return (
      <section className="section-spacing bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading organizational structure...</p>
          </div>
        </div>
      </section>
    );
  }

  // Use the fetched data
  const orgData = organizationData;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const togglePersonProfile = (personId: number) => {
    setSelectedPerson(selectedPerson === personId ? null : personId);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Crown, User, Shield, Users, Building, GraduationCap, Target, Globe, Briefcase
    };
    return iconMap[iconName] || User;
  };

  const renderPersonCard = (person: any, section: string) => {
    const name = currentLang === 'ar' ? person.nameAr : person.nameEn;
    const title = currentLang === 'ar' ? person.titleAr : person.titleEn;
    const role = currentLang === 'ar' ? person.roleAr : person.roleEn;
    const bio = currentLang === 'ar' ? person.bioAr : person.bioEn;
    const Icon = getIconComponent(person.icon);
    const isExpanded = selectedPerson === person.id;

    return (
      <div key={person.id} className="card group hover:shadow-xl transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              {person.photo ? (
                <img 
                  src={person.photo} 
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Icon className={`w-8 h-8 ${person.photo ? 'hidden' : ''} ${
                person.isChairman ? 'text-accent-orange-600' : 'text-primary-600'
              }`} />
            </div>
            {person.isChairman && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-secondary-700 mb-1 line-clamp-1">{name}</h3>
            <p className="text-primary-600 font-medium mb-1">{title}</p>
            <p className="text-secondary-500 text-sm mb-3">{role}</p>
            
            {/* Quick Contact */}
            <div className="flex items-center gap-3 mb-3">
              {person.email && (
                <a 
                  href={`mailto:${person.email}`}
                  className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  title={person.email}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {person.phone && (
                <a 
                  href={`tel:${person.phone}`}
                  className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  title={person.phone}
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {person.linkedin && (
                <a 
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {person.twitter && (
                <a 
                  href={`https://twitter.com/${person.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => togglePersonProfile(person.id)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
            >
              {isExpanded ? t.hideProfile : t.viewProfile}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Bio */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
            <p className="text-secondary-600 leading-relaxed mb-4">{bio}</p>
            
            {/* Contact Details */}
            {(person.email || person.phone) && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {person.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <a 
                      href={`mailto:${person.email}`}
                      className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      {person.email}
                    </a>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary-600" />
                    <a 
                      href={`tel:${person.phone}`}
                      className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      {person.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderDepartmentCard = (dept: any) => {
    const name = currentLang === 'ar' ? dept.nameAr : dept.nameEn;
    const role = currentLang === 'ar' ? dept.roleAr : dept.roleEn;
    const bio = currentLang === 'ar' ? dept.bioAr : dept.bioEn;
    const Icon = getIconComponent(dept.icon);

    return (
      <div key={dept.id} className="card group hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-secondary-700 mb-1">{name}</h3>
            <p className="text-primary-600 text-sm font-medium mb-2">{role}</p>
            <p className="text-secondary-600 text-sm leading-relaxed mb-3">{bio}</p>
            {dept.staffCount && (
              <div className="flex items-center gap-2 text-secondary-500 text-xs">
                <Users className="w-3 h-3" />
                <span>{dept.staffCount} {currentLang === 'ar' ? 'موظف' : 'staff members'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="section-spacing bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">{t.title}</h2>
          <p className="text-xl text-secondary-600 leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-700 mb-2">{orgData.board.length}</h3>
            <p className="text-secondary-600">{t.boardMembers}</p>
          </div>
          
          <div className="card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-700 mb-2">{orgData.management.length}</h3>
            <p className="text-secondary-600">{t.executiveTeam}</p>
          </div>
          
          <div className="card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-green-500 to-accent-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-700 mb-2">{orgData.departments.length}</h3>
            <p className="text-secondary-600">{t.departments}</p>
          </div>
        </div>

        {/* Board of Directors */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-secondary-700 flex items-center gap-3">
              <Crown className="w-8 h-8 text-accent-orange-600" />
              {t.boardTitle}
            </h3>
            <button
              onClick={() => toggleSection('board')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {expandedSections.includes('board') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {expandedSections.includes('board') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {orgData.board.map(person => renderPersonCard(person, 'board'))}
            </div>
          )}
        </div>

        {/* Executive Management */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-secondary-700 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-secondary-600" />
              {t.managementTitle}
            </h3>
            <button
              onClick={() => toggleSection('management')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {expandedSections.includes('management') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {expandedSections.includes('management') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {orgData.management.map(person => renderPersonCard(person, 'management'))}
            </div>
          )}
        </div>

        {/* Departments */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-secondary-700 flex items-center gap-3">
              <Building className="w-8 h-8 text-accent-green-600" />
              {t.departmentsTitle}
            </h3>
            <button
              onClick={() => toggleSection('departments')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {expandedSections.includes('departments') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {expandedSections.includes('departments') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {orgData.departments.map(dept => renderDepartmentCard(dept))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrganizationalStructure;
