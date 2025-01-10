// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClinicaDental {

    struct Cita {
        uint idCita;
        uint idPaciente;
        string profesionPaciente;
        uint edadPaciente;
		string peso;
		string pulso;
		string antecedentes_medicos;
        string tipoSangre;
        string alergias;
        string nombreDentista;
        uint fecha;
        string motivo;
        string observaciones;
        address dentistaWallet;
    }

    // Almacén para las citas
    Cita[] private citas;
    uint private siguienteIdCita = 1;
    mapping(uint => uint[]) private citasPorPaciente;

    address private admin;
    mapping(address => bool) private personalAutorizado;

    event CitaAgregada(uint idCita, uint idPaciente, string nombreDentista, uint fecha);

    constructor() {
        admin = msg.sender;
    }

    modifier soloAutorizado() {
        require(personalAutorizado[msg.sender] || msg.sender == admin, "Acceso denegado: no autorizado");
        _;
    }

    function cambiarPermisoAcceso(address _usuario, bool _permiso) public {
        require(msg.sender == admin, "Solo el admin puede cambiar permisos");
        personalAutorizado[_usuario] = _permiso;
    }

    // Función para agregar una nueva cita
    function agregarCita(
        uint _idPaciente,
        string memory _profesionPaciente,
        uint _edadPaciente,
		string memory _peso,
		string memory _pulso,
		string memory _antecedentes_medicos,
        string memory _tipoSangre,
        string memory _alergias,
        string memory _nombreDentista,
        uint _fecha,
        string memory _motivo,
        string memory _observaciones
    ) public soloAutorizado {
        Cita memory nuevaCita = Cita(
            siguienteIdCita,
            _idPaciente,
            _profesionPaciente,
            _edadPaciente,
			_peso,
			_pulso,
			_antecedentes_medicos,
            _tipoSangre,
            _alergias,
            _nombreDentista,
            _fecha,
            _motivo,
            _observaciones,
            msg.sender // Almacena la dirección del dentista que crea la cita
        );

        citas.push(nuevaCita);
        citasPorPaciente[_idPaciente].push(siguienteIdCita);
        emit CitaAgregada(siguienteIdCita, _idPaciente, _nombreDentista, _fecha);
        siguienteIdCita++;
    }

    // Función para obtener todas las citas de un paciente
    // Esta función solo obtiene las citas del paciente sin filtrar por dentista
    function getCitasDePacienteSinFiltrar(uint _idPaciente) public view returns (uint[] memory) {
        return citasPorPaciente[_idPaciente];
    }

    // Función para obtener las citas de un paciente y filtrarlas por el dentista
    function getCitasDePaciente(uint _idPaciente) public view soloAutorizado returns (Cita[] memory) {
        uint[] memory idsCitas = citasPorPaciente[_idPaciente];
        uint totalCitas = idsCitas.length;

        // Primero, contar cuántas citas corresponden al dentista
        uint contador = 0;
        for (uint i = 0; i < totalCitas; i++) {
            Cita storage cita = citas[idsCitas[i] - 1];
            if (cita.dentistaWallet == msg.sender) {
                contador++;
            }
        }

        // Crear un array con el tamaño adecuado para las citas del dentista
        Cita[] memory citasFiltradas = new Cita[](contador);
        uint index = 0;

        // Llenamos el array de citas filtradas
        for (uint i = 0; i < totalCitas; i++) {
            Cita storage cita = citas[idsCitas[i] - 1];
            if (cita.dentistaWallet == msg.sender) {
                citasFiltradas[index] = cita;
                index++;
            }
        }
        return citasFiltradas;
    }

    function getNumeroDeCitas() public view returns (uint) {
        return citas.length;
    }
}
