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
    pdf.text(artist.full_name, margin, currentY + 10);
    currentY += 20;

    // Headline/Bio
    if (artist.headline || artist.bio) {
      pdf.setFontSize(11);
      pdf.setTextColor(102, 102, 102);
      const text = artist.headline || artist.bio || '';
      const lines = pdf.splitTextToSize(text.substring(0, 150), contentWidth - 40);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 5 + 5;
    }

    // Location & Category
    if (artist.city || artist.state || artist.country || artist.category) {
      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      const location = [artist.city, artist.state, artist.country].filter(Boolean).join(', ');
      const category = artist.category ? artist.category.charAt(0).toUpperCase() + artist.category.slice(1) : '';
      
      if (location) {
        pdf.text(`📍 ${location}`, margin, currentY);
        currentY += 6;
      }
      if (category) {
        pdf.text(`🎭 ${category}`, margin, currentY);
        currentY += 6;
      }
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
      pdf.text(`📧 ${artist.email}`, margin, currentY);
      currentY += 6;
    }
    if (artist.phone_number) {
      pdf.text(`📞 ${artist.phone_number}`, margin, currentY);
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
        pdf.text(`${link.icon} ${link.label}: ${link.url}`, margin, currentY);
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
        pdf.text(project.project_name, margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        pdf.text(`Role: ${project.role_in_project}`, margin, currentY);
        currentY += 5;

        if (project.director_producer) {
          pdf.text(`Director/Producer: ${project.director_producer}`, margin, currentY);
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
      const skillsText = skills.map(skill => skill.skill).join(' • ');
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
        pdf.text(edu.qualification_name, margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        if (edu.institution) {
          pdf.text(edu.institution, margin, currentY);
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
        pdf.text(`${lang.language} - ${lang.proficiency}`, margin, currentY);
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
        pdf.text(award.award_name || 'Award', margin, currentY);
        currentY += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        if (award.awarding_organization) {
          pdf.text(award.awarding_organization, margin, currentY);
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