import Homepage from "./homepage/page";
import Checkpage from "./checkpage/page";
import Scanpage from "./scanpage/page";
import Profilepage from "./profile/page";
import Createpage from "./createproject/page";

const HorizontalSection = () => {
    return (
        <section id="horizentalpage" className="overflow-hidden transition duration-500 ease-in-out ">
            <div className="flex">
                <Homepage />
                <Scanpage />
                <Checkpage />
                <Createpage/>
                <Profilepage />
            </div>
        </section>
    );
};

export default HorizontalSection;
