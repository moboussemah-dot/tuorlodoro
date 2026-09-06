# Golden Yolks

fai un sito ecommerce per vendere uova, ecco strumenti e come: You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
glass-button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes,
    VariantProps {
  contentClassName?: string;
}

const GlassButton = React.forwardRef(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      


        
          
            {children}
          
        
        


      


    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };

demo.tsx
import { GlassButton } from "@/components/ui/glass-button";

const ZapIcon = (props: React.SVGProps) => (
  
    
);

const DottedBackground = () => (
  
    
      
        
      
    
    
);

const GlassButtonDemo = () => {
  return (
    


      
      


        


          
            Small
          
          
            Generate
            
            
          
          
            Submit
          
          
            
          
        


      


    


  );
};

export default GlassButtonDemo;

```

Install NPM dependencies:
```bash
class-variance-authority
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
Sono uova Bio, da una singola fattoria
altri: You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
gradient-blur-bg.tsx
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    


  {/* Purple Gradient Grid Right Background */}
  


   {/* Your Content/Components */}



  );
};


demo.tsx
import { Component } from "@/components/ui/gradient-blur-bg";

export default function DemoOne() {
  return <Component />;
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
altro:You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
testimonial-v2.tsx
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Sun, Moon } from 'lucide-react';

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://cdn.21st.dev/assets/mirror/9a/9aa2356c92e8798347a846b3f5ec5c4eecb7d0349130a0ac8b99d064fb925874.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://cdn.21st.dev/assets/mirror/11/11134d472e245bb9dcef8595979c5c375a8ad40d3adf72e03cf67b959415ea6f.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://cdn.21st.dev/assets/mirror/2f/2fbc7af54dccfd5fa3821f259c9b6c42eca0458948be89bbd7cf2e8c97c50930.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://cdn.21st.dev/assets/mirror/e0/e037bf69983d4b3792507a980afa576f7c76798a2b360f56d43a190a382e8acd.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://cdn.21st.dev/assets/mirror/96/9604967cdf4e4e0a351e601540b98e76aae71959e9cbe650f24184041848147d.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://cdn.21st.dev/assets/mirror/9e/9e606c4f1d8147ecda157277cbbcdf0409228ee64d28da1a9e74e9c8cdee92f2.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://cdn.21st.dev/assets/mirror/2c/2cfa4aba4bfefc920aa635f1bde5dab467c583463be9b13d93df6e18db5262f8.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://cdn.21st.dev/assets/mirror/21/211cb0e449e9bc8d24952d0bc62b660c1b7209b9c6a77a39ca6628e47ba178be.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://cdn.21st.dev/assets/mirror/37/377641f9868ec7fcd6e73ff1302f139857f8b4c203db487d0ca1296f031dadf4.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    


      
        {[
          ...new Array(2).fill(0).map((_, index) => (
            
              {props.testimonials.map(({ text, image, name, role }, i) => (
                
                  


                    


                      {text}
                    


                    


                      
                      


                        
                          {name}
                        
                        
                          {role}
                        
                      


                    


                  


                
              ))}
            
          )),
        ]}
      
    


  );
};

const TestimonialsSection = () => {
  return (
    


      
        


          


            


              Testimonials
            


          



          


            What our users say
          


          


            Discover how thousands of teams streamline their operations with our platform.
          


        



        


          
          
          
        


      
    


  );
};

// --- Main App Component ---
export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    


      {/* Dark Mode Toggle */}
       setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-xl hover:scale-110 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Toggle Dark Mode"
      >
        {isDark ?  : }
      

      
    


  );
}


demo.tsx
import Component from "@/components/ui/testimonial-v2";

export default function DemoOne() {
  return <Component />;
}

```

Install NPM dependencies:
```bash
lucide-react, framer-motion
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
ora usa tutto per fare il sito perfetto per vendere uova bio

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6076097a-0caa-440f-8502-04df8aa037bf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
