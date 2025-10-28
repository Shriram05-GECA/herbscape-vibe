import { useState } from "react";
import doctorVideo from "@/assets/doctor-animation.mp4";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";

export const RemediesAiWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("Remedies will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRemedy = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your physical problem to get a remedy",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse("🩺 Thinking... please wait...");

    try {
      const res = await fetch("https://sumitchaure.app.n8n.cloud/webhook/03add49f-f070-4a69-b142-e1bd48b92c52", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });

      const text = await res.text();
      setResponse(text || "⚠️ No response received.");
    } catch (err) {
      setResponse("❌ Error connecting to Remedies AI.");
      console.error(err);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Remedies AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <div
            className={`rounded-full overflow-hidden border-4 border-primary shadow-lg transition-all duration-300 ${
              isHovered ? "w-24 h-24 scale-110" : "w-20 h-20"
            }`}
          >
            <video
              src={doctorVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {isHovered && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg font-medium">
                Remedies AI
              </div>
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Leaf className="h-6 w-6 text-primary" />
              🌿 Remedies AI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">Describe your physical problem below:</p>
            <Textarea
              placeholder="e.g., sore throat, headache, acne..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button 
              onClick={handleGetRemedy} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Getting Remedy..." : "Get Remedy"}
            </Button>
            <div className="bg-accent/30 rounded-lg p-4 min-h-[150px] border border-accent">
              <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                {response}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
