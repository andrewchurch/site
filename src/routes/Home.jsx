import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import Colophon from '../components/Colophon/Colophon.jsx';
import Arcade from '../components/Arcade/Arcade.jsx';
import Portfolio from '../components/Portfolio/Portfolio.jsx';

const availablePanels = ['arcade', 'portfolio'];
const defaultPanel = 'portfolio';
const mobileWindowWidth = 768;

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const colophonRef = useRef(null);
    const overflowContainerRef = useRef(null);
    const isMobile = useRef(false);
    const isScrolling = useRef(false);

    // adjust classes as necessary based on active panel
    const activePanel = availablePanels.includes(searchParams.get('p')) ? searchParams.get('p') : defaultPanel;
    const overflowClasses = activePanel === 'arcade' ? ['md:overflow-hidden'] : [];
    const containerClasses = activePanel === 'portfolio' ? ['md:-translate-x-1/3'] : [];

    function changePanel(panel, scroll) {

        // scroll to top of page for mobile
        if (isMobile.current && panel === 'arcade' && scroll) {
            
            isScrolling.current = true;

            overflowContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            // track scrollTo so we know when it ended
            // this allows us not to changePanel based on scroll while we are automatically being scrolled
            let scrollTimeout;
            const scrollTracker = function(e) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    isScrolling.current = false;
                    overflowContainerRef.current.removeEventListener('scroll', scrollTracker);
                }, 100);
            };
            overflowContainerRef.current.addEventListener('scroll', scrollTracker);
        }

        // if we are navigating to the default panel, remove the param to keep a clean url
        if (panel === defaultPanel) {
            searchParams.delete('p');
            setSearchParams(searchParams);
        } else {
            setSearchParams({
                'p': panel
            });
        }
    }

    function handleScroll() {

        // when bottom of colophon is off the screen, we're mostly looking at first panel
        if (!isScrolling.current) {
            const colophonRect = colophonRef.current.getBoundingClientRect();
            changePanel((colophonRect.y + 50) > window.innerHeight ? 'arcade' : 'portfolio', false);
        }
    }

    const throttledHandleScroll = debounce(() => {
        handleScroll();
    }, 50);

    function responsiveSetup() {
        isMobile.current = window.innerWidth <= mobileWindowWidth;
        if (isMobile.current) {
            overflowContainerRef.current.addEventListener('scroll', throttledHandleScroll);
        } else {
            overflowContainerRef.current.removeEventListener('scroll', throttledHandleScroll);
        }
    }

    useEffect(() => {
        window.addEventListener('resize', responsiveSetup); 
        responsiveSetup();

        // on mobile if default panel is active scroll to it
        if (isMobile.current && activePanel === defaultPanel) {
            colophonRef.current.scrollIntoView({
                block: 'start',
            });
        }

        return () => window.removeEventListener('resize', responsiveSetup);
    }, []);

    return (
        <div ref={overflowContainerRef} className={`${overflowClasses.join(' ')} snap-y overflow-y-auto h-screen md:snap-none md:overflow-x-clip`}>
            <div className={`${containerClasses} md:transition-transform grid grid-rows-[minmax(100%,auto),repeat(2,minmax(50%,auto))] h-screen md:h-auto md:min-h-screen md:grid-rows-none md:grid-cols-3 md:w-[150%]`}>
                <Colophon ref={colophonRef} changePanel={ (panel) => changePanel(panel, true) } activePanel={activePanel} />
                <Portfolio />
                <Arcade overflowContainerRef={overflowContainerRef} />
            </div>
        </div>
    );
}