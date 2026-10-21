// remotion/compositions/SocialMediaPost.tsx
// Example: Instagram/Social Media Post Template

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence
} from 'remotion';

interface SocialMediaPostProps {
  title: string;
  subtitle: string;
  backgroundColor: string;
  accentColor: string;
  logo?: string;
  backgroundImage?: string;
}

export const SocialMediaPost: React.FC<SocialMediaPostProps> = ({
  title,
  subtitle,
  backgroundColor,
  accentColor,
  logo,
  backgroundImage
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation calculations
  const titleScale = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  const subtitleOpacity = interpolate(
    frame,
    [30, 45],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const logoRotation = interpolate(
    frame,
    [0, 60],
    [0, 360],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Background Image */}
      {backgroundImage && (
        <AbsoluteFill>
          <img
            src={backgroundImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3
            }}
          />
        </AbsoluteFill>
      )}

      {/* Animated Background Elements */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: accentColor,
            opacity: 0.2,
            transform: `scale(${interpolate(frame, [0, 120], [0, 1.5])})`
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: accentColor,
            opacity: 0.15,
            transform: `scale(${interpolate(frame, [60, 180], [0, 1.2])})`
          }}
        />
      </AbsoluteFill>

      {/* Main Content */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Title */}
          <h1
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              transform: `scale(${titleScale})`,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: accentColor,
              margin: '40px 0 0 0',
              opacity: subtitleOpacity,
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Logo */}
        {logo && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              right: 60,
              transform: `rotate(${logoRotation}deg)`
            }}
          >
            <img
              src={logo}
              style={{
                width: 80,
                height: 80,
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* Decorative Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${interpolate(frame, [90, 150], [0, 100])}%`,
          height: 8,
          background: accentColor
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// remotion/compositions/ProductShowcase.tsx
// Example: Product Demo/Showcase Template

interface ProductShowcaseProps {
  productName: string;
  tagline: string;
  features: string[];
  productImage: string;
  backgroundColor: string;
  textColor: string;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  productName,
  tagline,
  features,
  productImage,
  backgroundColor,
  textColor
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Intro - Product Name */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h1
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: textColor,
              opacity: spring({
                frame,
                fps,
                config: { damping: 200 }
              }),
              transform: `translateY(${interpolate(
                spring({ frame, fps, config: { damping: 200 } }),
                [0, 1],
                [100, 0]
              )}px)`
            }}
          >
            {productName}
          </h1>
        </AbsoluteFill>
      </Sequence>

      {/* Product Image with Tagline */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 100
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src={productImage}
              style={{
                width: '100%',
                height: 'auto',
                transform: `scale(${spring({
                  frame: frame - 90,
                  fps,
                  config: { damping: 100 }
                })})`
              }}
            />
          </div>
          <div style={{ flex: 1, paddingLeft: 80 }}>
            <h2
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.3,
                opacity: interpolate(
                  frame - 90,
                  [20, 40],
                  [0, 1]
                )
              }}
            >
              {tagline}
            </h2>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Features List */}
      <Sequence from={240} durationInFrames={durationInFrames - 240}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            padding: 100
          }}
        >
          <h3
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: textColor,
              marginBottom: 60
            }}
          >
            Key Features
          </h3>
          {features.map((feature, index) => {
            const featureFrame = frame - 240 - (index * 30);
            const featureOpacity = spring({
              frame: featureFrame,
              fps,
              config: { damping: 200 }
            });

            return (
              <div
                key={index}
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  color: textColor,
                  marginBottom: 30,
                  opacity: featureOpacity,
                  transform: `translateX(${interpolate(
                    featureOpacity,
                    [0, 1],
                    [-50, 0]
                  )}px)`,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ marginRight: 20, fontSize: 32 }}>✓</span>
                {feature}
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================
// remotion/compositions/TextAnimator.tsx
// Example: Kinetic Typography Template

interface TextAnimatorProps {
  text: string;
  style: 'glitch' | 'typewriter' | 'wave' | 'fade';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export const TextAnimator: React.FC<TextAnimatorProps> = ({
  text,
  style,
  backgroundColor,
  textColor,
  fontSize
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const renderText = () => {
    switch (style) {
      case 'typewriter':
        return renderTypewriter();
      case 'wave':
        return renderWave();
      case 'glitch':
        return renderGlitch();
      case 'fade':
        return renderFade();
      default:
        return text;
    }
  };

  const renderTypewriter = () => {
    const charsToShow = Math.floor(interpolate(
      frame,
      [0, 120],
      [0, text.length],
      { extrapolateRight: 'clamp' }
    ));
    return text.slice(0, charsToShow);
  };

  const renderWave = () => {
    return text.split('').map((char, i) => {
      const yOffset = Math.sin((frame + i * 5) / 10) * 20;
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: `translateY(${yOffset}px)`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const renderGlitch = () => {
    const shouldGlitch = frame % 60 < 5;
    return (
      <span
        style={{
          textShadow: shouldGlitch
            ? `${Math.random() * 10}px ${Math.random() * 10}px 0 #ff00ff,
               ${Math.random() * -10}px ${Math.random() * -10}px 0 #00ffff`
            : 'none',
          transform: shouldGlitch
            ? `translate(${Math.random() * 10}px, ${Math.random() * 10}px)`
            : 'none'
        }}
      >
        {text}
      </span>
    );
  };

  const renderFade = () => {
    return text.split('').map((char, i) => {
      const opacity = interpolate(
        frame,
        [i * 2, i * 2 + 20],
        [0, 1],
        { extrapolateRight: 'clamp' }
      );
      return (
        <span key={i} style={{ opacity }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color: textColor,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        {renderText()}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// remotion/Root.tsx
// Registration of all compositions

import { Composition } from 'remotion';
import { SocialMediaPost } from './compositions/SocialMediaPost';
import { ProductShowcase } from './compositions/ProductShowcase';
import { TextAnimator } from './compositions/TextAnimator';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="social-media-post"
        component={SocialMediaPost}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          title: 'Amazing Product',
          subtitle: 'Transform Your Business',
          backgroundColor: '#6366f1',
          accentColor: '#fbbf24',
          logo: '/logo.png'
        }}
      />

      <Composition
        id="product-showcase"
        component={ProductShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: 'Your Product',
          tagline: 'The future of innovation',
          features: [
            'Lightning Fast Performance',
            'Beautiful User Interface',
            'Enterprise-Grade Security',
            'Seamless Integration'
          ],
          productImage: '/product.png',
          backgroundColor: '#1e1e1e',
          textColor: '#ffffff'
        }}
      />

      <Composition
        id="text-animator"
        component={TextAnimator}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: 'AMAZING TYPOGRAPHY',
          style: 'wave',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontSize: 120
        }}
      />
    </>
  );
};
