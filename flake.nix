{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      allSystems = [ "x86_64-linux" "aarch64-linux" ];

      forAllSystems = f: nixpkgs.lib.genAttrs allSystems (system: f (
        import nixpkgs {
          inherit system;
        }
      ));
    in
    {
      devShells = forAllSystems (pkgs: with pkgs; {
        default = mkShell {
          buildInputs = [
            nodejs_22
            nodejs_22.pkgs.pnpm
          ];
        };
      });
    };
}
