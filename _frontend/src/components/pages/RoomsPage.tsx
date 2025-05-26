import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  name: string;
};

const RoomsPage = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=400"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
          Create room
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-300"
            >
              New room name
            </label>
            <div className="mt-2">
              <input
                {...register('name')}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-400 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

      <ul className="mt-10 text-gray-300">Existing rooms:</ul>
    </div>
  );
};

export default RoomsPage;
