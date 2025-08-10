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

// Enhanced text sanitization function to remove unwanted characters and ensure Unicode compatibility
const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    // Remove specific problematic character patterns
    .replace(/Ø=Üç/g, '')
    .replace(/Ø=ÜÞ/g, '')
    .replace(/Ø=Ü¼/g, '')
    .replace(/Üd,ca\./g, '')
    .replace(/�/g, '') // Remove replacement characters
    // Remove zero-width characters and other invisible characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove control characters but preserve valid Unicode
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Remove any remaining non-printable characters while preserving Unicode text
    .replace(/[^\x20-\x7E\n\r\t\u00A0-\uFFFF]/g, '')
    // Clean up multiple spaces and leading/trailing whitespace
    .replace(/\s+/g, ' ')
    .replace(/^[^\w\s\u00A0-\uFFFF]+/, '') // Remove leading special characters
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

    // Set Unicode-compatible font for better character support
    // jsPDF's built-in fonts have limited Unicode support, but 'helvetica' with proper text sanitization
    // provides the best compatibility across different systems
    pdf.setFont('helvetica', 'normal');

    // Add Maasta Logo
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = '/lovable-uploads/4fe9af1f-50da-4516-b1d1-a001e4effef3.png';
      });
      
      const logoCanvas = document.createElement('canvas');
      const logoCtx = logoCanvas.getContext('2d');
      if (logoCtx) {
        logoCanvas.width = logoImg.naturalWidth;
        logoCanvas.height = logoImg.naturalHeight;
        logoCtx.drawImage(logoImg, 0, 0);
        const logoData = logoCanvas.toDataURL('image/png', 1.0);
        // Improved logo sizing - maintain aspect ratio and full visibility
        const logoAspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
        const logoHeight = 12;
        const logoWidth = logoHeight * logoAspectRatio;
        pdf.addImage(logoData, 'PNG', margin, currentY, logoWidth, logoHeight);
      }
    } catch (error) {
      console.warn('Could not add Maasta logo to PDF:', error);
      // Fallback to text
      pdf.setFontSize(12);
      pdf.setTextColor(255, 130, 0); // Maasta orange
      pdf.text('MAASTA', margin, currentY + 5);
    }

    // Profile Picture (Circular)
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
          const size = 150; // Increased canvas size for better quality
          canvas.width = size;
          canvas.height = size;
          
          // Fill with white background first
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);
          
          // Create circular clipping path
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
          ctx.clip();
          
          // Calculate image positioning to maintain aspect ratio and full visibility
          const imgAspectRatio = img.naturalWidth / img.naturalHeight;
          let drawWidth = size;
          let drawHeight = size;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imgAspectRatio > 1) {
            // Image is wider than tall
            drawHeight = size / imgAspectRatio;
            offsetY = (size - drawHeight) / 2;
          } else {
            // Image is taller than wide
            drawWidth = size * imgAspectRatio;
            offsetX = (size - drawWidth) / 2;
          }
          
          // Draw image with proper scaling and centering
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          // Improved profile picture sizing and positioning
          const profileSize = 40; // Increased PDF size
          pdf.addImage(imgData, 'JPEG', pageWidth - margin - profileSize - 5, currentY - 5, profileSize, profileSize);
        }
      } catch (error) {
        console.warn('Could not add profile picture to PDF:', error);
      }
    }
    
    currentY += 15;

    // Header background with gradient effect
    pdf.setFillColor(255, 245, 235); // Light orange background
    pdf.rect(margin - 5, currentY - 5, contentWidth + 10, 35, 'F');
    
    // Full Name
    pdf.setFontSize(26);
    pdf.setTextColor(51, 51, 51);
    pdf.text(sanitizeText(artist.full_name), margin, currentY + 8);
    currentY += 15;

    // Headline/Bio
    if (artist.headline || artist.bio) {
      pdf.setFontSize(12);
      pdf.setTextColor(102, 102, 102);
      const text = sanitizeText(artist.headline || artist.bio || '');
      const lines = pdf.splitTextToSize(text.substring(0, 150), contentWidth - 40);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 5 + 5;
    }

    currentY += 15;

    // Basic Information Section
    pdf.setFillColor(255, 130, 0); // Orange header background
    pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255); // White text on orange background
    pdf.text('✨ Basic Information', margin, currentY + 4);
    currentY += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 51, 51);

    // Age calculation
    const age = calculateAge(artist.date_of_birth);
    if (age) {
      pdf.text(`👤 Age: ${age} years`, margin, currentY);
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

    // Email
    if (artist.email) {
      pdf.text(`📧 Email: ${sanitizeText(artist.email)}`, margin, currentY);
      currentY += 6;
    }

    // Phone
    if (artist.phone_number) {
      pdf.text(`📞 Phone: ${sanitizeText(artist.phone_number)}`, margin, currentY);
      currentY += 6;
    }

    currentY += 10;

    // Social Profiles Section
    const socialLinks = [
      { label: 'Website', url: artist.personal_website, icon: '🌐' },
      { label: 'Instagram', url: artist.instagram, icon: '📷' },
      { label: 'LinkedIn', url: artist.linkedin, icon: '💼' },
      { label: 'YouTube/Vimeo', url: artist.youtube_vimeo, icon: '🎥' },
      { label: 'IMDB', url: artist.imdb_profile, icon: '🎬' },
    ].filter(link => link.url);

    if (socialLinks.length > 0) {
      pdf.setFillColor(100, 100, 100); // Gray header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.text('🔗 Social Profiles', margin, currentY + 4);
      currentY += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      socialLinks.forEach(link => {
        pdf.text(`${link.icon} ${link.label}: ${sanitizeText(link.url)}`, margin, currentY);
        currentY += 6;
      });
      currentY += 10;
    }

    // Check if we need a new page
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin;
    }

    // Projects Section
    const projects = artist.projects || [];
    if (projects.length > 0) {
      pdf.setFillColor(255, 130, 0); // Orange header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('🎬 Projects & Work', margin, currentY + 4);
      currentY += 15;

      projects.forEach((project, index) => {
        if (currentY > pageHeight - 50) {
          pdf.addPage();
          currentY = margin;
        }

        // Project background
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin - 3, currentY - 3, contentWidth + 6, 35, 'F');

        pdf.setFontSize(12);
        pdf.setTextColor(51, 51, 51);
        pdf.text(sanitizeText(project.project_name), margin, currentY + 3);
        currentY += 8;

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

        // Project Link
        if (project.link) {
          pdf.setTextColor(34, 139, 34); // Green for links
          pdf.text(`🔗 View Project: ${sanitizeText(project.link)}`, margin, currentY);
          currentY += 5;
        }

        currentY += 10;
      });
    }

    // Skills Section
    const skills = artist.special_skills || [];
    if (skills.length > 0) {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFillColor(100, 100, 100); // Gray header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('⭐ Skills & Expertise', margin, currentY + 4);
      currentY += 15;

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

      pdf.setFillColor(255, 130, 0); // Orange header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('🎓 Education & Training', margin, currentY + 4);
      currentY += 15;

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

      pdf.setFillColor(100, 100, 100); // Gray header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('🌍 Languages', margin, currentY + 4);
      currentY += 15;

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
      if (currentY > pageHeight - 90) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFillColor(150, 75, 0); // Dark orange header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('📸 Media Portfolio', margin, currentY + 4);
      currentY += 15;

      try {
        const imageSize = 40; // Increased size for better quality
        const imageSpacing = 8; // Space between images
        const imagesPerRow = 2;
        
        // Add subtle background for media section
        pdf.setFillColor(248, 248, 248);
        const mediaRows = Math.ceil(photos.length / imagesPerRow);
        pdf.rect(margin - 3, currentY - 3, contentWidth + 6, mediaRows * (imageSize + imageSpacing) + 6, 'F');
        
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const row = Math.floor(i / imagesPerRow);
          const col = i % imagesPerRow;
          
          const x = margin + 5 + col * (imageSize + imageSpacing * 2);
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
              canvas.width = 250;
              canvas.height = 250;
              ctx.drawImage(img, 0, 0, 250, 250);
              const imgData = canvas.toDataURL('image/jpeg', 0.8);
              
              // Add border around image
              pdf.setDrawColor(200, 200, 200);
              pdf.setLineWidth(0.5);
              pdf.rect(x - 1, y - 1, imageSize + 2, imageSize + 2);
              
              pdf.addImage(imgData, 'JPEG', x, y, imageSize, imageSize);
            }
          } catch (error) {
            console.warn(`Could not add media image ${i + 1} to PDF:`, error);
            // Draw placeholder rectangle with pattern
            pdf.setFillColor(240, 240, 240);
            pdf.rect(x, y, imageSize, imageSize, 'F');
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, y, imageSize, imageSize);
            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(8);
            pdf.text('Image', x + imageSize/3, y + imageSize/2);
          }
        }
        
        // Update currentY to account for the images
        const rows = Math.ceil(photos.length / imagesPerRow);
        currentY += rows * (imageSize + imageSpacing) + 15;
        
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

      pdf.setFillColor(255, 215, 0); // Gold header background
      pdf.rect(margin - 5, currentY - 2, contentWidth + 10, 8, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0); // Black text on gold
      pdf.text('🏆 Awards & Achievements', margin, currentY + 4);
      currentY += 15;

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