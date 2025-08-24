const Footer = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex h-14 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Vertex Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
