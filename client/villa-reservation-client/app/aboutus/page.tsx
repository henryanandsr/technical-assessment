import React from "react";
import NavigationBar from "../components/NavigationBar";
import aboutUsImage from "../assets/aboutUs.webp"; // Import your image

function AboutUsPage() {
  return (
    <div>
      <NavigationBar />

      <div className="min-h-screen bg-gray-100 pt-24">
        <div className="container mx-auto p-8">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between">
            <div className="lg:w-1/2 mr-2">
              <h1 className="text-4xl font-bold mb-4 lg:mb-8">About Us</h1>
              <p className="text-lg text-gray-700 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur?
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit
                esse quam nihil molestiae consequatur, vel illum qui dolorem eum
                fugiat quo voluptas nulla pariatur?
              </p>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <img
                src={aboutUsImage.src}
                alt="About Us"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
