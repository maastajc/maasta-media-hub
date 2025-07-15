import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Artist } from '@/types/artist';

export interface PDFGenerationOptions {
  includeProfilePicture: boolean;
  includeCoverImage: boolean;
  includeMedia: boolean;
  watermark: boolean;
}

const defaultOptions: PDFGenerationOptions = {
  includeProfilePicture: true,
  includeCoverImage: false,
  includeMedia: true,
  watermark: true,
};

// Text sanitization function to remove unwanted characters
const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/Ø=Üç/g, '')
    .replace(/Ø=ÜÞ/g, '')
    .replace(/Ø=Ü¼/g, '')
    .replace(/[^\x20-\x7E\u00A0-\u017F\u0100-\u024F]/g, '') // Remove non-printable chars
    .trim();
};

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const generatePortfolioPDF = async (
  artist: Artist,
  options: PDFGenerationOptions = defaultOptions
): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let currentY = margin;

    // Set font
    pdf.setFont('helvetica');

    // Header with Logo/Brand
    pdf.setFontSize(12);
    pdf.setTextColor(255, 130, 0); // Maasta orange
    pdf.text('MAASTA', margin, currentY);
    currentY += 10;

    // Profile Picture
    if (options.includeProfilePicture && artist.profile_picture_url) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = artist.profile_picture_url + '?t=' + Date.now();
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          pdf.addImage(imgData, 'JPEG', pageWidth - margin - 30, currentY, 30, 30);
        }
      } catch (error) {
        console.warn('Could not add profile picture to PDF:', error);
      }
    }

    // Full Name
    pdf.setFontSize(24);
    pdf.setTextColor(51, 51, 51);
    pdf.text(sanitizeText(artist.full_name), margin, currentY + 10);
    currentY += 20;

    // Headline/Bio
    if (artist.headline || artist.bio) {
      pdf.setFontSize(11);
      pdf.setTextColor(102, 102, 102);
      const text = sanitizeText(artist.headline || artist.bio || '');
      const lines = pdf.splitTextToSize(text.substring(0, 150), contentWidth - 40);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 5 + 5;
    }

    currentY += 10;

    // Basic Information Section
    pdf.setFontSize(14);
    pdf.setTextColor(255, 130, 0);
    pdf.text('Basic Information', margin, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 51, 51);

    // Age calculation
    const age = calculateAge(artist.date_of_birth);
    if (age) {
      pdf.text(`Age: ${age}`, margin, currentY);
      currentY += 6;
    }

    // Location info
    if (artist.city || artist.state || artist.country) {
      const location = [sanitizeText(artist.city), sanitizeText(artist.state), sanitizeText(artist.country)]
        .filter(Boolean).join(', ');
      if (location) {
        pdf.text(`📍 Location: ${location}`, margin, currentY);
        currentY += 6;
      }
    }

    // Category
    if (artist.category) {
      const category = sanitizeText(artist.category.charAt(0).toUpperCase() + artist.category.slice(1));
      pdf.text(`🎭 Category: ${category}`, margin, currentY);
      currentY += 6;
    }

    // Work preference
    if (artist.work_preference) {
      const workPref = sanitizeText(artist.work_preference.charAt(0).toUpperCase() + artist.work_preference.slice(1));
      pdf.text(`💼 Work Preference: ${workPref}`, margin, currentY);
      currentY += 6;
    }

    currentY += 10;

    // Contact Information Header
    pdf.setFontSize(14);
    pdf.setTextColor(255, 130, 0);
    pdf.text('Contact Information', margin, currentY);
    currentY += 8;

    // Email and Phone
    pdf.setFontSize(10);
    pdf.setTextColor(51, 51, 51);
    if (artist.email) {
      pdf.text(`📧 ${sanitizeText(artist.email)}`, margin, currentY);
      currentY += 6;
    }
    if (artist.phone_number) {
      pdf.text(`📞 ${sanitizeText(artist.phone_number)}`, margin, currentY);
      currentY += 6;
    }

    // Social Links
    const socialLinks = [
      { label: 'Website', url: artist.personal_website, icon: '🌐' },
      { label: 'Instagram', url: artist.instagram, icon: '📷' },
      { label: 'LinkedIn', url: artist.linkedin, icon: '💼' },
      { label: 'YouTube', url: artist.youtube_vimeo, icon: '🎥' },
      { label: 'IMDB', url: artist.imdb_profile, icon: '🎬' },
    ].filter(link => link.url);

    if (socialLinks.length > 0) {
      currentY += 5;
      socialLinks.forEach(link => {
        pdf.text(`${link.icon} ${link.label}: ${sanitizeText(link.url)}`, margin, currentY);
        currentY += 6;
      });
    }

    currentY += 10;

    // Check if we need a new page
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin;
    }

    // Projects Section
    const projects = artist.projects || [];
    if (projects.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Projects & Work', margin, currentY);
      currentY += 8;

      projects.forEach((project, index) => {
        if (currentY > pageHeight - 40) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(51, 51, 51);
        pdf.text(sanitizeText(project.project_name), margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        pdf.text(`Role: ${sanitizeText(project.role_in_project)}`, margin, currentY);
        currentY += 5;

        if (project.director_producer) {
          pdf.text(`Director/Producer: ${sanitizeText(project.director_producer)}`, margin, currentY);
          currentY += 5;
        }

        if (project.year_of_release) {
          pdf.text(`Year: ${project.year_of_release}`, margin, currentY);
          currentY += 5;
        }

        if (project.project_type) {
          pdf.text(`Type: ${project.project_type.replace('_', ' ')}`, margin, currentY);
          currentY += 5;
        }

        currentY += 8;
      });
    }

    // Skills Section
    const skills = artist.special_skills || [];
    if (skills.length > 0) {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Skills & Expertise', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      const skillsText = skills.map(skill => sanitizeText(skill.skill)).join(' • ');
      const skillLines = pdf.splitTextToSize(skillsText, contentWidth);
      pdf.text(skillLines, margin, currentY);
      currentY += skillLines.length * 5 + 10;
    }

    // Education Section
    const education = artist.education || artist.education_training || [];
    if (education.length > 0) {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Education & Training', margin, currentY);
      currentY += 8;

      education.forEach((edu) => {
        if (currentY > pageHeight - 25) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(51, 51, 51);
        pdf.text(sanitizeText(edu.qualification_name), margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        if (edu.institution) {
          pdf.text(sanitizeText(edu.institution), margin, currentY);
          currentY += 5;
        }
        if (edu.year_completed) {
          pdf.text(`Year: ${edu.year_completed}`, margin, currentY);
          currentY += 5;
        }
        currentY += 5;
      });
    }

    // Languages Section
    const languages = artist.language_skills || [];
    if (languages.length > 0) {
      if (currentY > pageHeight - 25) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Languages', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      languages.forEach((lang) => {
        pdf.text(`${sanitizeText(lang.language)} - ${sanitizeText(lang.proficiency)}`, margin, currentY);
        currentY += 6;
      });
      currentY += 5;
    }

    // Work Preferences Section
    if (artist.work_preference || artist.willing_to_relocate !== undefined) {
      if (currentY > pageHeight - 25) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Work Preferences', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      
      if (artist.work_preference) {
        pdf.text(`Preferred Work Type: ${artist.work_preference.charAt(0).toUpperCase() + artist.work_preference.slice(1)}`, margin, currentY);
        currentY += 6;
      }
      
      if (artist.willing_to_relocate !== undefined) {
        pdf.text(`Willing to Relocate: ${artist.willing_to_relocate ? 'Yes' : 'No'}`, margin, currentY);
        currentY += 6;
      }
    }

    // Media Portfolio Section
    const mediaAssets = artist.media_assets || [];
    const photos = mediaAssets.filter(asset => !asset.is_video).slice(0, 4);
    
    if (options.includeMedia && photos.length > 0) {
      if (currentY > pageHeight - 80) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Media Portfolio', margin, currentY);
      currentY += 10;

      try {
        const imageSize = 35; // Size of each thumbnail
        const imageSpacing = 5; // Space between images
        const imagesPerRow = 2;
        
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const row = Math.floor(i / imagesPerRow);
          const col = i % imagesPerRow;
          
          const x = margin + col * (imageSize + imageSpacing);
          const y = currentY + row * (imageSize + imageSpacing);
          
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = photo.url + '?t=' + Date.now();
            });
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = 200;
              canvas.height = 200;
              ctx.drawImage(img, 0, 0, 200, 200);
              const imgData = canvas.toDataURL('image/jpeg', 0.7);
              pdf.addImage(imgData, 'JPEG', x, y, imageSize, imageSize);
            }
          } catch (error) {
            console.warn(`Could not add media image ${i + 1} to PDF:`, error);
            // Draw placeholder rectangle
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, y, imageSize, imageSize);
          }
        }
        
        // Update currentY to account for the images
        const rows = Math.ceil(photos.length / imagesPerRow);
        currentY += rows * (imageSize + imageSpacing) + 10;
        
      } catch (error) {
        console.warn('Error processing media portfolio images:', error);
      }
    }

    // Awards Section
    const awards = artist.awards || [];
    if (awards.length > 0) {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(255, 130, 0);
      pdf.text('Awards & Achievements', margin, currentY);
      currentY += 8;

      awards.forEach((award) => {
        if (currentY > pageHeight - 25) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(51, 51, 51);
        pdf.text(sanitizeText(award.award_name || 'Award'), margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        if (award.awarding_organization) {
          pdf.text(sanitizeText(award.awarding_organization), margin, currentY);
          currentY += 5;
        }
        if (award.year) {
          pdf.text(`Year: ${award.year}`, margin, currentY);
          currentY += 5;
        }
        currentY += 5;
      });
    }

    // Footer with Maasta watermark
    if (options.watermark) {
      const pageCount = (pdf as any).internal.pages.length - 1; // -1 because first page is null
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(200, 200, 200);
        pdf.text('Generated via Maasta.in', margin, pageHeight - 10);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, pageHeight - 10);
      }
    }

    // Download the PDF
    const fileName = `${artist.full_name.replace(/[^a-zA-Z0-9]/g, '_')}_Portfolio.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};