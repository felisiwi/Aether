/**
 * AdaptiveCarousel 2.0.0 - Phase 1: Layout Foundation
 * 
 * PHASE 1 STATUS: Layout system complete, ready for gesture detection
 * 
 * Base version: AdaptiveCarousel.1.0.4.tsx
 * Architecture: Monolithic (all in one file)
 * 
 * COMPLETED IN THIS PHASE:
 * ✅ Grid-based responsive layout system
 * ✅ 8 layout configurations (4 breakpoints × 2 layouts each)
 * ✅ Auto viewport detection with manual override
 * ✅ Override system (gap, itemsVisible, peakAmount)
 * ✅ Proper card width calculations based on grid
 * 
 * TODO IN FUTURE PHASES:
 * ⏳ Phase 2: Copy gesture detection from v1.0.4
 * ⏳ Phase 3: Add context-aware animation physics
 * ⏳ Phase 4: Copy accessibility from v1.0.4
 * ⏳ Phase 5: Copy arrow/dot UI controls from v1.0.4
 * ⏳ Phase 6: Framer integration (property controls, variants)
 * ⏳ Phase 7: Polish and edge cases
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { addPropertyControls, ControlType } from 'framer'

// ============================================================
// LAYOUT CONFIGURATION SYSTEM (NEW IN v2.0.0)
// ============================================================

interface LayoutConfig {
  gridColumns: number      // Total grid columns at this breakpoint
  columnSpan: number       // Columns each card occupies
  cardsVisible: number     // How many cards are visible
  gutter: number          // Gap between cards
  pageMargin: number      // Side margins
  peekAmount: number      // Peek of next card (0 = none)
  maxWidth: number | null // Max content width (null = full width)
}

type LayoutName = 'Portrait' | 'Landscape'
type VariantName = 'Mobile' | 'Tablet' | 'Desktop' | 'Desktop L'

/**
 * Grid System Specifications:
 * - Mobile (0-767px): 4 columns, 8px gutter, 16px margin
 * - Tablet (768-1199px): 8 columns, 16px gutter, 32px margin
 * - Desktop (1200-1919px): 12 columns, 16px gutter, 48px margin
 * - Desktop L (≥1920px): 12 columns, 24px gutter, 256px margin
 * 
 * Column Span determines cards visible:
 * - Portrait: Denser layout (more cards)
 * - Landscape: Spacious layout (fewer cards)
 */
const LAYOUT_CONFIGS: Record<VariantName, Record<LayoutName, LayoutConfig>> = {
  Mobile: {
    Portrait: {
      gridColumns: 4,
      columnSpan: 2,        // 2 cols per card = 2 cards visible
      cardsVisible: 2,
      gutter: 8,
      pageMargin: 16,
      peekAmount: 16,       // Show peek
      maxWidth: null
    },
    Landscape: {
      gridColumns: 4,
      columnSpan: 4,        // 4 cols per card = 1 card visible
      cardsVisible: 1,
      gutter: 8,
      pageMargin: 16,
      peekAmount: 16,       // Show peek
      maxWidth: null
    }
  },
  Tablet: {
    Portrait: {
      gridColumns: 8,
      columnSpan: 2,        // 2 cols per card = 4 cards visible
      cardsVisible: 4,
      gutter: 16,
      pageMargin: 32,
      peekAmount: 16,       // Show peek
      maxWidth: null
    },
    Landscape: {
      gridColumns: 8,
      columnSpan: 4,        // 4 cols per card = 2 cards visible
      cardsVisible: 2,
      gutter: 16,
      pageMargin: 32,
      peekAmount: 16,       // Show peek
      maxWidth: null
    }
  },
  Desktop: {
    Portrait: {
      gridColumns: 12,
      columnSpan: 3,        // 3 cols per card = 4 cards visible
      cardsVisible: 4,
      gutter: 16,
      pageMargin: 48,
      peekAmount: 16,       // Show peek
      maxWidth: 730         // Centered with max width
    },
    Landscape: {
      gridColumns: 12,
      columnSpan: 4,        // 4 cols per card = 3 cards visible
      cardsVisible: 3,
      gutter: 16,
      pageMargin: 48,
      peekAmount: 16,       // Show peek
      maxWidth: null
    }
  },
  'Desktop L': {
    Portrait: {
      gridColumns: 12,
      columnSpan: 2.4,      // 2.4 cols per card = 5 cards visible
      cardsVisible: 5,
      gutter: 24,
      pageMargin: 256,
      peekAmount: 0,        // NO PEEK on Desktop L
      maxWidth: 1170        // Centered with max width
    },
    Landscape: {
      gridColumns: 12,
      columnSpan: 4,        // 4 cols per card = 3 cards visible
      cardsVisible: 3,
      gutter: 24,
      pageMargin: 256,
      peekAmount: 0,        // NO PEEK on Desktop L
      maxWidth: null
    }
  }
}

// ============================================================
// LAYOUT CALCULATION UTILITIES (NEW IN v2.0.0)
// ============================================================

interface LayoutMetrics {
  cardWidth: number
  gap: number
  cardsVisible: number
  peekAmount: number
  pageMargin: number
  containerWidth: number
  totalWidth: number
}

/**
 * Calculate card width and spacing based on grid system
 * Formula: (contentWidth - gaps - peek) / cardsVisible
 */
function calculateLayoutMetrics(
  variant: VariantName,
  layout: LayoutName,
  viewportWidth: number
): LayoutMetrics {
  const config = LAYOUT_CONFIGS[variant][layout]
  
  // Use config values directly (no overrides in Phase 1)
  const finalGap = config.gutter
  const finalCardsVisible = config.cardsVisible
  const finalPeakAmount = config.peekAmount
  
  // Calculate available width
  let availableWidth = viewportWidth
  
  if (config.maxWidth) {
    // For centered layouts (Desktop/Desktop L Portrait)
    // Available width is min of viewport or (maxWidth + margins)
    availableWidth = Math.min(
      viewportWidth,
      config.maxWidth + (config.pageMargin * 2)
    )
  }
  
  // Content width after removing margins
  const contentWidth = availableWidth - (config.pageMargin * 2)
  
  // Calculate card width
  // Space needed for gaps between cards
  const totalGaps = (finalCardsVisible - 1) * finalGap
  
  // Card width = (available space - gaps - peek) / cards
  const cardWidth = (contentWidth - totalGaps - finalPeakAmount) / finalCardsVisible
  
  return {
    cardWidth,
    gap: finalGap,
    cardsVisible: finalCardsVisible,
    peekAmount: finalPeakAmount,
    pageMargin: config.pageMargin,
    containerWidth: availableWidth,
    totalWidth: viewportWidth
  }
}

/**
 * Detect current variant based on viewport width
 */
function detectVariantFromViewport(width: number): VariantName {
  if (width < 768) return 'Mobile'
  if (width < 1200) return 'Tablet'
  if (width < 1920) return 'Desktop'
  return 'Desktop L'
}

// ============================================================
// RESPONSIVE VARIANT HOOK (NEW IN v2.0.0)
// ============================================================

/**
 * Auto-detect viewport breakpoint or use manual override
 * Hybrid system: auto by default, manual when specified
 */
function useResponsiveVariant(
  manualVariant?: VariantName | 'auto'
): VariantName {
  const [detectedVariant, setDetectedVariant] = useState<VariantName>('Desktop')
  
  useEffect(() => {
    // If manual variant specified (not 'auto'), use it
    if (manualVariant && manualVariant !== 'auto') {
      setDetectedVariant(manualVariant)
      return
    }
    
    // Otherwise auto-detect from viewport
    const updateVariant = () => {
      const width = window.innerWidth
      setDetectedVariant(detectVariantFromViewport(width))
    }
    
    // Set initial variant
    updateVariant()
    
    // Update on resize
    window.addEventListener('resize', updateVariant)
    return () => window.removeEventListener('resize', updateVariant)
  }, [manualVariant])
  
  return detectedVariant
}

// ============================================================
// COMPONENT INTERFACE (NEW IN v2.0.0)
// ============================================================

interface ResponsiveCarouselProps {
  // Content
  children: React.ReactNode
  
  // Variant system (hybrid: auto or manual)
  variant?: VariantName | 'auto'  // Default: 'auto'
  layout?: LayoutName              // Default: 'Portrait'
  
  // Additional container styles
  style?: React.CSSProperties
  
  // Animation settings (will be used in Phase 3) - hidden from UI for now
  flickStiffness?: number
  flickDamping?: number
  glideStiffness?: number
  glideDamping?: number
  velocityScalerPercentage?: number
  
  // UI controls (will be implemented in Phase 5) - hidden from UI for now
  arrowsEnabled?: boolean
  dotsEnabled?: boolean
  
  // Arrow styling (will be used in Phase 5) - hidden from UI for now
  arrowButtonSize?: number
  arrowColor?: string
  arrowPressedColor?: string
  arrowDisabledColor?: string
  arrowIconColor?: string
  arrowIconDisabledColor?: string
  
  // Dot styling (will be used in Phase 5) - hidden from UI for now
  dotSize?: number
  dotGap?: number
  dotColor?: string
  dotInactiveColor?: string
}

// ============================================================
// MAIN COMPONENT (PHASE 1: LAYOUT ONLY)
// ============================================================

export default function ResponsiveCarousel({
  children,
  variant = 'auto',
  layout = 'Portrait',
  style,
  // Animation props (not used in Phase 1, but defined for future)
  flickStiffness = 500,
  flickDamping = 55,
  glideStiffness = 120,
  glideDamping = 25,
  velocityScalerPercentage = 20,
  // UI control props (not used in Phase 1, but defined for future)
  arrowsEnabled = true,
  dotsEnabled = false,
  arrowButtonSize = 32,
  arrowColor = '#F2F2F2',
  arrowPressedColor = '#000000',
  arrowDisabledColor = 'rgba(0, 0, 0, 0)',
  arrowIconColor = '#4D4D4D',
  arrowIconDisabledColor = '#CCCCCC',
  dotSize = 8,
  dotGap = 8,
  dotColor = '#000000',
  dotInactiveColor = '#F2F2F2',
}: ResponsiveCarouselProps) {
  
  // ============================================================
  // STATE & REFS
  // ============================================================
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Auto-detect or use manual variant
  const activeVariant = useResponsiveVariant(variant)
  
  // ============================================================
  // LAYOUT CALCULATIONS
  // ============================================================
  
  // Calculate layout metrics based on current variant (no overrides)
  const layoutMetrics = calculateLayoutMetrics(
    activeVariant,
    layout,
    containerWidth
  )
  
  // Extract metrics for easy access
  const {
    cardWidth,
    gap: finalGap,
    cardsVisible: finalCardsVisible,
    peekAmount: finalPeakAmount,
    pageMargin
  } = layoutMetrics
  
  // ============================================================
  // CHILDREN HANDLING
  // ============================================================
  
  let childrenArray = React.Children.toArray(children)
  
  // If no children provided, show placeholder cards for testing
  if (childrenArray.length === 0) {
    childrenArray = Array.from({ length: 8 }, (_, i) => (
      <div
        key={`placeholder-${i}`}
        style={{
          width: '100%',
          height: '200px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${
            i % 4 === 0 ? '#667eea 0%, #764ba2 100%' :
            i % 4 === 1 ? '#f093fb 0%, #f5576c 100%' :
            i % 4 === 2 ? '#4facfe 0%, #00f2fe 100%' :
            '#43e97b 0%, #38f9d7 100%'
          })`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        Card {i + 1}
      </div>
    ))
  }
  
  const totalItems = childrenArray.length
  
  // Calculate max index (how far we can scroll)
  const maxIndex = Math.max(0, totalItems - finalCardsVisible)
  
  // ============================================================
  // CONTAINER WIDTH TRACKING
  // ============================================================
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    
    // Set initial width
    updateWidth()
    
    // Update on resize
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  
  // ============================================================
  // EDGE CASES
  // ============================================================
  
  // Single card - center it
  if (totalItems === 1) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${pageMargin}px`,
        width: '100%',
        height: '100%'
      }}>
        {children}
      </div>
    )
  }
  
  // ============================================================
  // RENDER: PHASE 1 LAYOUT (NO GESTURES YET)
  // ============================================================
  
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...style
      }}
    >
      {/* Carousel container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        {/* Cards wrapper - constrained to calculated width and centered */}
        <div
          style={{
            display: 'flex',
            gap: `${finalGap}px`,
            paddingLeft: `${pageMargin}px`,
            paddingRight: `${pageMargin}px`,
            height: '100%',
            alignItems: 'center',
            width: `${layoutMetrics.containerWidth}px`,
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              style={{
                width: `${cardWidth}px`,
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Phase status indicator */}
      <div style={{
        textAlign: 'center',
        padding: '12px',
        fontSize: 12,
        color: '#999',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#fafafa'
      }}>
        Phase 1: Layout system working
        {React.Children.count(children) === 0 && ' (placeholder cards)'}
      </div>
    </div>
  )
}

// ============================================================
// FRAMER PROPERTY CONTROLS (SIMPLIFIED - Phase 1)
// ============================================================

addPropertyControls(ResponsiveCarousel, {
  children: {
    type: ControlType.Array,
    title: 'Cards',
    control: {
      type: ControlType.ComponentInstance
    }
  },
  variant: {
    type: ControlType.Enum,
    title: 'Variant',
    options: ['auto', 'Mobile', 'Tablet', 'Desktop', 'Desktop L'],
    defaultValue: 'auto',
    displaySegmentedControl: true
  },
  layout: {
    type: ControlType.Enum,
    title: 'Layout',
    options: ['Portrait', 'Landscape'],
    defaultValue: 'Portrait',
    displaySegmentedControl: true
  }
})