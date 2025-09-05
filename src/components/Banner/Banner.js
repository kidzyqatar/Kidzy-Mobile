import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '@constants/theme';
import { callNonTokenApi } from '../../helpers/ApiRequest';
import config from '@constants/config';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as RootNavigation from '@navigators/RootNavigation';
import { LanguageContext } from '../../store/LanguageContext'; // Add this import

const Banner = ({ type, style, onPress }) => {
  const { t } = useTranslation();
  const global = useSelector(state => state.global);
  const { language } = useContext(LanguageContext); // Add this line
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const autoPlayRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchBanners();
    return () => clearInterval(autoPlayRef.current);
  }, [type, language]); // Add language to dependency array

  const fetchBanners = async () => {
    setLoading(true);
    // Convert LanguageContext values to API format
    const locale = language === 'AR' ? 'ar' : 'en';
    // Fixed: Use only the dynamic locale parameter
    const apiUrl = `${config.api.baseURL}/banners/type/${type}?locale=${locale}`;

    try {
      const response = await callNonTokenApi(apiUrl, 'GET');
      const bannerData = response.data?.banners || response.data || [];
      setBanners(bannerData);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % banners.length;
          Animated.timing(slideAnim, {
            toValue: -nextIndex * screenWidth,
            duration: 400,
            useNativeDriver: true,
          }).start();
          return nextIndex;
        });
      }, 5000);

      return () => clearInterval(autoPlayRef.current);
    }
  }, [banners, screenWidth]);

  const handleBannerPress = (banner) => {
    if (onPress) return onPress(banner);

    if (banner.product_id) {
      RootNavigation.navigate('ProductDetail', { id: banner.product_id });
    } else if (banner.category_slug) {
      RootNavigation.navigate('ProductListing', { slug: banner.category_slug });
    }
  };

  const handleBuyNowPress = () => {
    RootNavigation.navigate('Categories');
  };

  const handleExploreBrandsPress = () => {
    RootNavigation.navigate('Brands');
  };

  // Get brand logo based on banner content or type
  const getBrandLogo = (banner, bannerType) => {
    // Force Zuru logo for top banner (Slider)
    if (bannerType === 'Slider') {
      return 'https://kidzy.prismatech.agency/assets/images/zuru1.png';
    }
    
    if (banner.title?.toLowerCase().includes('hot wheels') || banner.title?.toLowerCase().includes('kidzy')) {
      return 'https://kidzy.prismatech.agency/assets/images/zuru1.png';
    } else if (banner.title?.toLowerCase().includes('lego')) {
      return 'https://kidzy.prismatech.agency/assets/images/lego-logo.png';
    }
    return 'https://kidzy.prismatech.agency/assets/images/lego-logo.png'; // Default to LEGO logo
  };

  // Get promotional content based on banner type
  const getPromotionalContent = (banner, bannerType) => {
    if (bannerType === 'Middle') {
      return {
        mainText: t('exploreOurCollection'),
        subtitle: '',
        showSecondaryButton: true,
        secondaryButtonText: t('exploreBrands')
      };
    } else if (bannerType === 'Bottom') {
      return {
        mainText: t('specialOffers'),
        subtitle: '',
        showSecondaryButton: false,
        secondaryButtonText: ''
      };
    }
    return {
      mainText: t('welcomeToKidzy'),
      subtitle: t('discoverAmazingToys'),
      showSecondaryButton: false,
      secondaryButtonText: ''
    };
  };

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#999' }}>No {type} banners available</Text>
      </View>
    );
  }

  if (type === 'Slider') {
    return (
      <View>
        <View style={{ width: screenWidth, overflow: 'hidden' }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX: slideAnim }],
            }}
          >
            {banners.map((banner, index) => {
              const promoContent = getPromotionalContent(banner);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleBannerPress(banner)}
                  activeOpacity={0.9}
                  style={{
                    width: screenWidth,
                    height: 200,
                  }}
                >
                  <ImageBackground
                    source={{ uri: banner.full_image }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}
                    imageStyle={{ width: screenWidth, height: 200 }}
                  >
                    {/* Dark overlay for better text visibility */}
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      }}
                    />
                    
                    {/* Content overlay */}
                    <View
                      style={{
                        flex: 1,
                        padding: 20,
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Brand Logo */}
                      <View style={{ alignItems: 'flex-start' }}>
                        <Image
                          source={{ uri: getBrandLogo(banner, 'Slider') }}
                          style={{
                            width: 80,
                            height: 25,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>

                      {/* Promotional Content */}
                      <View style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: 28,
                            fontFamily: FONTS.bold,
                            marginBottom: 8,
                            textShadowColor: 'rgba(0, 0, 0, 0.8)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 3,
                          }}
                        >
                          {promoContent.mainText}
                        </Text>
                        
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: 14,
                            fontFamily: FONTS.regular,
                            marginBottom: 20,
                            opacity: 0.9,
                            textShadowColor: 'rgba(0, 0, 0, 0.8)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 3,
                          }}
                        >
                          {promoContent.subtitle}
                        </Text>

                        {/* Action Buttons */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                          <TouchableOpacity
                            onPress={handleBuyNowPress}
                            style={{
                              backgroundColor: '#FF6B35',
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              borderRadius: 25,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.white,
                                fontSize: 14,
                                fontFamily: FONTS.medium,
                                marginRight: 5,
                              }}
                            >
                              {t('buyNow')}
                            </Text>
                            <Text style={{ color: COLORS.white, fontSize: 16 }}>→</Text>
                          </TouchableOpacity>

                          {promoContent.showSecondaryButton && (
                            <TouchableOpacity
                              onPress={handleExploreBrandsPress}
                              style={{
                                borderWidth: 2,
                                borderColor: COLORS.white,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                borderRadius: 25,
                              }}
                            >
                              <Text
                                style={{
                                  color: COLORS.white,
                                  fontSize: 14,
                                  fontFamily: FONTS.medium,
                                }}
                              >
                                {promoContent.secondaryButtonText}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>

        {/* Pagination */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
        }}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={{
                width: currentIndex === i ? 10 : 8,
                height: currentIndex === i ? 10 : 8,
                borderRadius: 5,
                marginHorizontal: 4,
                backgroundColor: currentIndex === i ? COLORS.primary : '#ccc',
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  // For other types like Middle, Bottom
  return (
    <View>
      {banners.map((banner, index) => {
        const promoContent = getPromotionalContent(banner, type);
        
        if (type === 'Middle') {
          // Middle Banner - Left-aligned Layout
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleBannerPress(banner)}
              activeOpacity={0.9}
              style={{
                width: SIZES.width,
                height: 280,
                marginHorizontal: 0,
                marginVertical: 10,
                borderRadius: 0,
              }}
            >
              <ImageBackground
                source={{ uri: banner.full_image }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
                imageStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
              >
                {/* Gradient overlay */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}
                />
                
                {/* Left-aligned Content */}
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'flex-start',
                  paddingHorizontal: 30,
                  paddingVertical: 40,
                }}>
                  {/* LEGO Logo on Left */}
                  <View style={{ marginBottom: 30 }}>
                    <Image
                      source={{ uri: getBrandLogo(banner, 'Middle') }}
                      style={{
                        width: 100,
                        height: 60,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  {/* Main Text - Left Aligned */}
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 36,
                      fontFamily: FONTS.bold,
                      textAlign: 'left',
                      marginBottom: 40,
                      textShadowColor: 'rgba(0, 0, 0, 0.8)',
                      textShadowOffset: { width: 2, height: 2 },
                      textShadowRadius: 4,
                      lineHeight: 42,
                    }}
                  >
                    {promoContent.mainText}
                  </Text>
                  
                  {/* Action Buttons - Left Aligned */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 16,
                  }}>
                    {/* Buy Now Button */}
                    <TouchableOpacity
                      onPress={handleBuyNowPress}
                      style={{
                        backgroundColor: '#FF6B35',
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        minWidth: 130,
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 14,
                          fontFamily: FONTS.medium,
                          marginRight: 5,
                        }}
                      >
                        {t('buyNow')}
                      </Text>
                      <Text style={{ color: COLORS.white, fontSize: 18 }}>→</Text>
                    </TouchableOpacity>

                    {/* Explore Brands Button */}
                    <TouchableOpacity
                      onPress={handleExploreBrandsPress}
                      style={{
                        borderWidth: 2,
                        borderColor: COLORS.white,
                        paddingHorizontal: 28,
                        paddingVertical: 12,
                        borderRadius: 25,
                        minWidth: 150,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 16,
                          fontFamily: FONTS.medium,
                        }}
                      >
                        {t('exploreBrands')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        } else if (type === 'Bottom') {
          // Bottom Banner - Left-aligned Layout like "Special Offers"
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleBannerPress(banner)}
              activeOpacity={0.9}
              style={{
                width: SIZES.width,
                height: 200,
                marginHorizontal: 0,
                marginVertical: 10,
                borderRadius: 0,
              }}
            >
              <ImageBackground
                source={{ uri: banner.full_image }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
                imageStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
              >
                {/* Dark overlay */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}
                />
                
                {/* Left-aligned Content */}
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'flex-start',
                  paddingHorizontal: 30,
                  paddingVertical: 25,
                }}>
                  {/* LEGO Logo at Top Left */}
                  <View style={{ marginBottom: 20 }}>
                    <Image
                      source={{ uri: getBrandLogo(banner, 'Bottom') }}
                      style={{
                        width: 80,
                        height: 50,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  {/* Main Text */}
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 28,
                      fontFamily: FONTS.bold,
                      textAlign: 'left',
                      marginBottom: 25,
                      textShadowColor: 'rgba(0, 0, 0, 0.8)',
                      textShadowOffset: { width: 2, height: 2 },
                      textShadowRadius: 4,
                      lineHeight: 32,
                    }}
                  >
                    {promoContent.mainText}
                  </Text>
                  
                  {/* Single Buy Now Button */}
                  <TouchableOpacity
                    onPress={handleBuyNowPress}
                    style={{
                      backgroundColor: '#FF6B35',
                      paddingHorizontal: 28,
                      paddingVertical: 12,
                      borderRadius: 25,
                      flexDirection: 'row',
                      alignItems: 'center',
                      minWidth: 130,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 14,
                        fontFamily: FONTS.medium,
                        marginRight: 5,
                      }}
                    >
                      {t('buyNow')}
                    </Text>
                    <Text style={{ color: COLORS.white, fontSize: 18 }}>→</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

export default Banner;
