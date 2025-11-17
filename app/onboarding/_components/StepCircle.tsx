const variants = {
  prev: `h-3 w-3 bg-blue-700/30 `,
  default: `bg-gray-400 h-4 w-4`,
  active: `bg-blue-500 h-4 w-4`,
};

type variantTypes = keyof typeof variants;

export default function StepCircle({ variant }: { variant: variantTypes }) {
  const stepVariant = variants[variant];
  return <div className={` rounded-full ${stepVariant}`}></div>;
}
