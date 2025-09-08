"use client";

import { Check, Crown, LinkIcon, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { assignHeadmasterToSchool } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, generateId } from "@/lib/utils";
import {
  type AvailableHeadmaster,
  getAvailableHeadmastersClient,
} from "@/services/clientDataService";

interface AssignHeadMasterProps {
  schoolId: string;
  schoolName: string;
}

export function AssignHeadMaster({
  schoolId,
  schoolName,
}: AssignHeadMasterProps) {
  const [open, setOpen] = useState(false);
  const [selectedHeadMaster, setSelectedHeadMaster] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [options, setOptions] = useState<AvailableHeadmaster[]>([]);

  // Fetch available headmasters data
  useEffect(() => {
    const fetchHeadMasters = async () => {
      if (open) {
        setIsLoadingOptions(true);
        try {
          const headmasters = await getAvailableHeadmastersClient();
          setOptions(headmasters);
        } catch (error) {
          console.error("Error fetching headmasters:", error);
          toast.error("Erreur lors du chargement des proviseurs");
        } finally {
          setIsLoadingOptions(false);
        }
      }
    };

    fetchHeadMasters();
  }, [open]);

  const filteredOptions = options.filter((option) => {
    return (
      option.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.school_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  async function handleAssignHeadMaster() {
    if (!selectedHeadMaster) {
      toast.error("Veuillez sélectionner un proviseur");
      return;
    }

    setIsAssigning(true);
    try {
      const result = await assignHeadmasterToSchool(
        schoolId,
        selectedHeadMaster,
      );

      if (result.success) {
        const selectedOption = options.find(
          (option) => option.id === selectedHeadMaster,
        );
        const fullName = selectedOption
          ? selectedOption.full_name
          : "Proviseur";

        let successMessage = `${fullName} affecté avec succès à ${schoolName}`;
        if (
          selectedOption?.hasHeadmasterRole ||
          selectedOption?.hasDirectorRole
        ) {
          successMessage += " (rôles précédents supprimés)";
        }

        toast.success(successMessage);
        setOpen(false);
        setSelectedHeadMaster("");
        setSearchQuery("");
      } else {
        toast.error(
          result.message || "Erreur lors de l'affectation du proviseur",
        );
      }
    } catch (error) {
      console.error("Error assigning headmaster:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'affectation du proviseur",
      );
    } finally {
      setIsAssigning(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setSelectedHeadMaster("");
    setSearchQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <LinkIcon className="h-4 w-4" />
        Affecter un proviseur
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Affecter un proviseur</DialogTitle>
          <DialogDescription>
            Sélectionnez un proviseur à affecter à {schoolName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Command shouldFilter={false} className="rounded-lg border">
            <div className="relative px-2 pt-2">
              <CommandInput
                placeholder="Rechercher par nom, email ou établissement..."
                className="pl-8 h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>

            <CommandList className="mt-2 max-h-[300px] overflow-y-auto">
              {isLoadingOptions ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 5 }).map(() => (
                    <div
                      key={generateId()}
                      className="flex items-center space-x-3 p-2"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty className="py-6 text-center text-muted-foreground">
                    <User className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>Aucun proviseur trouvé.</p>
                    <p className="text-xs">Essayez une autre recherche</p>
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => {
                      return (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={(value) => {
                            setSelectedHeadMaster(
                              value === selectedHeadMaster ? "" : value,
                            );
                          }}
                          className="flex items-center gap-2 p-2 aria-selected:bg-muted"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {option.full_name}
                                </span>
                                {(option.hasHeadmasterRole ||
                                  option.hasDirectorRole) && (
                                  <div className="flex items-center gap-1">
                                    {option.hasHeadmasterRole && (
                                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        <Crown className="h-3 w-3" />
                                        <span>Proviseur</span>
                                      </div>
                                    )}
                                    {option.hasDirectorRole && (
                                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                        <Shield className="h-3 w-3" />
                                        <span>Directeur</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {option.email && (
                                <span className="text-xs text-muted-foreground">
                                  {option.email}
                                </span>
                              )}
                              {option.school_name && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  Établissement actuel: {option.school_name}
                                </span>
                              )}
                              {(option.hasHeadmasterRole ||
                                option.hasDirectorRole) && (
                                <span className="text-xs text-amber-600 mt-1 font-medium">
                                  ⚠️ Rôle existant - sera remplacé par Proviseur
                                </span>
                              )}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-2 h-5 w-5 flex-shrink-0 text-primary",
                              selectedHeadMaster === option.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAssignHeadMaster}
            disabled={!selectedHeadMaster || isAssigning}
          >
            {isAssigning ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Affectation...
              </>
            ) : (
              "Affecter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
