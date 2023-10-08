import {CarouselProvider, Slider, ButtonBack, ButtonNext} from 'pure-react-carousel'
import { useTheme, useMediaQuery } from '@mui/material'
import left from '../../assets/icons/left.svg'
import right from '../../assets/icons/right.svg'

interface CarousalImagesProps {
    children?: React.ReactNode[]
}

const LeftBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: "55%", 
    zIndex: 1, 
    transform: "translateY(-50%)", 
    borderRadius: 50, 
    width: 60, 
    height: 60,
    opacity: 0.6,
    border: "transparent",
}

const RightBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: "55%", 
    zIndex: 1, 
    right: 0,
    transform: "translateY(-50%)", 
    borderRadius: 50, 
    width: 60, 
    height: 60,
    opacity: 0.6,
    border: "transparent",
}

const CarousalImages = ({children} : CarousalImagesProps) => {
    const theme = useTheme();
    const mediaQuery = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={120}
        visibleSlides={mediaQuery ? 1 : 4}
        totalSlides={(children && children?.length > 0) ? children.length: 0}
        lockOnWindowScroll={false}
        dragEnabled={false}        
        >
            <ButtonBack style={LeftBtnStyle}>
                <img src={left} alt="" />
            </ButtonBack>
            <ButtonNext style={RightBtnStyle}>
                <img src={right} alt="" />
            </ButtonNext>
            <Slider style={{textAlign : '-webkit-center', height: "500px"}}>
                {children}
            </Slider>
    </CarouselProvider>
  )
}

export default CarousalImages