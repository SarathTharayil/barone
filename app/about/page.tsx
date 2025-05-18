import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-barone-darkteal">About Bar One</h1>

      <Tabs defaultValue="about">
        <div className="relative overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="mb-6 flex w-full bg-barone-darkteal/10 p-1">
              <TabsTrigger
                value="about"
                className="flex-1 whitespace-nowrap px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                About Me
              </TabsTrigger>
              <TabsTrigger
                value="inspiration"
                className="flex-1 whitespace-nowrap px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Inspiration
              </TabsTrigger>
              <TabsTrigger
                value="instructions"
                className="flex-1 whitespace-nowrap px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                How To Use
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="about" className="mt-0">
          <Card className="border-barone-darkteal/20">
            <CardHeader className="bg-barone-darkteal/5">
              <CardTitle className="text-barone-darkteal">About the Creator</CardTitle>
              <CardDescription>Learn more about who created Bar One</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-muted-foreground">
              <p>
                Hello! I'm the creator of Bar One, a web application designed to showcase modern web development
                techniques and provide a comprehensive solution for bar management.
              </p>

              <p>
                With a background in web development and a passion for creating intuitive user interfaces, I developed
                Bar One as a demonstration of what's possible with modern frameworks like Next.js, Tailwind CSS, and
                Supabase.
              </p>

              <p>
                My goal was to create a platform that not only looks great but also provides practical functionality for
                bar owners, staff, and customers alike. From menu management to table reservations, Bar One aims to
                streamline the entire bar experience.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-barone-darkteal mb-2">Skills & Technologies</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Next.js & React</li>
                  <li>Tailwind CSS</li>
                  <li>Supabase (PostgreSQL)</li>
                  <li>UI/UX Design</li>
                  <li>Responsive Web Development</li>
                  <li>Data Visualization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspiration" className="mt-0">
          <Card className="border-barone-darkteal/20">
            <CardHeader className="bg-barone-darkteal/5">
              <CardTitle className="text-barone-darkteal">Project Inspiration</CardTitle>
              <CardDescription>The story behind Bar One</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-muted-foreground">
              <p>
                Bar One was inspired by the need for modern, digital solutions in the hospitality industry. Many bars
                and restaurants still rely on outdated systems or paper-based processes, which can lead to
                inefficiencies and poor customer experiences.
              </p>

              <p>
                The COVID-19 pandemic further highlighted the importance of digital transformation in this sector, with
                many establishments needing to quickly adapt to online ordering, contactless menus, and digital payment
                systems.
              </p>

              <p>
                Drawing inspiration from successful hospitality apps and websites, Bar One aims to combine the best
                features into a cohesive, user-friendly platform that addresses the unique needs of bars and their
                customers.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-barone-darkteal mb-2">Key Inspirations</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modern digital menus with filtering and search capabilities</li>
                  <li>Interactive bar maps for table reservations</li>
                  <li>Transparent information sharing (deals, policies, inventory)</li>
                  <li>Data-driven insights for bar management</li>
                  <li>Recipe sharing to engage customers and build community</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="mt-0">
          <Card className="border-barone-darkteal/20">
            <CardHeader className="bg-barone-darkteal/5">
              <CardTitle className="text-barone-darkteal">How To Use Bar One</CardTitle>
              <CardDescription>Instructions for navigating and using the website</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-barone-darkteal mb-2">Navigation</h3>
                <p>
                  Bar One features a simple navigation system. On desktop, you'll find navigation links at the top of the
                  page. On mobile devices, tap the menu icon in the top-right corner to access the navigation menu.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-barone-darkteal mb-2">Key Features</h3>

                <div>
                  <h4 className="text-lg font-medium text-barone-darkteal mb-1">Menu</h4>
                  <p>
                    Browse our menu items by category. Use the search bar to find specific items, or use the filters to
                    narrow down by price range or tags. Click on any menu item to see more details.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-barone-darkteal mb-1">Recipes</h4>
                  <p>
                    Explore our drink recipes. Filter by category (All, Cocktails, Mocktails, Hot Drinks) and use the search
                    function to find specific recipes. Click on the accordion sections to view ingredients and preparation
                    steps.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-barone-darkteal mb-1">Bar Map</h4>
                  <p>
                    View our bar layout and check table availability. Switch between indoor and outdoor seating using the
                    tabs. Click on any table to see details and reserve if available.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-barone-darkteal mb-1">Information</h4>
                  <p>
                    Find information about our deals, policies, and inventory alerts. Use the tabs to navigate between
                    different types of information.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-barone-darkteal mb-1">Stats</h4>
                  <p>
                    View bar performance metrics and trends. This section is primarily for staff and management but provides
                    interesting insights for customers as well.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
