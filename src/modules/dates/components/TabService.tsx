import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function TabService(props: { setSection: (section: string) => void }) {
  const [services, setServices] = useState<{ name: string; price: string }[]>([
    { name: '', price: '' },
  ]);

  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { name: '', price: '' }]);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    props.setSection('Summary');
    console.log('Selected Services:', services);
  };

  return (
    <div className="flex flex-col w-full mt-5">
      <div>
			{services.map((service, index) => (
				<div
					key={index}
					className="p-3 flex items-center border justify-between border-gray-300 mx-4 mb-4 rounded-xl"
				>
					<div className="flex items-center space-x-4 w-full">
						<input
							type="text"
							placeholder="Nombre del tratamiento"
							value={service.name}
							onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
							className="border-b-2 focus:outline-none focus:border-primary-pressed text-base text-[#595959] w-2/3"
						/>
						<span className="text-[#595959] font-semibold">$</span>
						<input
							type="number"
							placeholder="Precio"
							value={service.price}
							onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
							className="border-b-2 focus:outline-none focus:border-primary-pressed text-base text-[#595959] w-1/3"
						/>
					</div>
					<button
						type="button"
						onClick={() => setServices((prev) => prev.filter((_, i) => i !== index))}
						className="ml-4 text-white bg-primary-500 px-3 py-1 rounded-md transition-all duration-200 shadow-sm"
						disabled={services.length <= 1}
					>
						<DeleteIcon/>
					</button>
				</div>
			))}
				<div className="flex justify-end items-center space-x-3 mx-4 mb-4">
					<button
						type="button"
						onClick={addService}
						className="flex items-center justify-center h-9 px-5 rounded-lg text-white bg-primary-pressed hover:bg-primary transition-all duration-200 shadow-sm"
					>
						<AddIcon/>
					</button>
				</div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={services.some((service) => !service.name || !service.price)}
        className="h-12 mx-4 mb-7 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white"
      >
        CONTINUAR
      </button>
    </div>
  );
}
