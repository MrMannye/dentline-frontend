// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClinicaDental {

    // Estructura para almacenar la información completa de una cita
    struct Cita {
        uint idCita;               // ID único de la cita
        string nombrePaciente;     // Nombre del paciente
        string profesionPaciente;  // Profesión del paciente
        uint edadPaciente;         // Edad del paciente
        string tipoSangre;         // Tipo de sangre del paciente
        string[] alergias;         // Alergias del paciente
        string nombreDentista;     // Nombre del dentista
        string profesionDentista;  // Profesión del dentista
        string telefonoDentista;   // Teléfono del dentista
        uint fecha;                // Fecha de la cita (en timestamp)
        string motivo;             // Motivo de la cita
        uint costoTotal;           // Costo total de la cita
        string observaciones;      // Observaciones de la cita
    }

    // Almacén para las citas
    Cita[] private citas;        // Lista de citas
    uint private siguienteIdCita = 1; // ID autoincremental para las citas

    address private admin;       // Dirección del administrador
    mapping(address => bool) private personalAutorizado; // Control de acceso

    event CitaAgregada(uint idCita, string nombrePaciente, string nombreDentista, uint fecha);

    // Constructor: Establece al creador como administrador
    constructor() {
        admin = msg.sender;
    }

    // Modificador que asegura que solo el personal autorizado puede ejecutar la función
    modifier soloAutorizado() {
        require(personalAutorizado[msg.sender] || msg.sender == admin, "Acceso denegado: no autorizado");
        _;
    }

    // Función para cambiar el acceso de un usuario
    function cambiarPermisoAcceso(address _usuario, bool _permiso) public {
        require(msg.sender == admin, "Solo el admin puede cambiar permisos");
        personalAutorizado[_usuario] = _permiso;
    }

    // Función para agregar una nueva cita
    function agregarCita(
        string memory _nombrePaciente,
        string memory _profesionPaciente,
        uint _edadPaciente,
        string memory _tipoSangre,
        string[] memory _alergias,
        string memory _nombreDentista,
        string memory _profesionDentista,
        string memory _telefonoDentista,
        uint _fecha,
        string memory _motivo,
        uint _costoTotal,
        string memory _observaciones
    ) public soloAutorizado {
        citas.push(Cita(
            siguienteIdCita,
            _nombrePaciente,
            _profesionPaciente,
            _edadPaciente,
            _tipoSangre,
            _alergias,
            _nombreDentista,
            _profesionDentista,
            _telefonoDentista,
            _fecha,
            _motivo,
            _costoTotal,
            _observaciones
        ));
        emit CitaAgregada(siguienteIdCita, _nombrePaciente, _nombreDentista, _fecha);
        siguienteIdCita++;
    }

    // Función para obtener una cita específica por su ID
    function getCita(uint _idCita) public view soloAutorizado returns (
        string memory nombrePaciente,
        string memory profesionPaciente,
        uint edadPaciente,
        string memory tipoSangre,
        string[] memory alergias,
        string memory nombreDentista,
        string memory profesionDentista,
        string memory telefonoDentista,
        uint fecha,
        string memory motivo,
        uint costoTotal,
        string memory observaciones
    ) {
        require(_idCita > 0 && _idCita < siguienteIdCita, "Cita no encontrada");
        Cita memory cita = citas[_idCita - 1];
        return (
            cita.nombrePaciente,
            cita.profesionPaciente,
            cita.edadPaciente,
            cita.tipoSangre,
            cita.alergias,
            cita.nombreDentista,
            cita.profesionDentista,
            cita.telefonoDentista,
            cita.fecha,
            cita.motivo,
            cita.costoTotal,
            cita.observaciones
        );
    }

    // Función para obtener todas las citas de un paciente por su nombre
    function getCitasDePaciente(string memory _nombrePaciente) public view soloAutorizado returns (Cita[] memory) {
        uint totalCitas = citas.length;

        // Contar cuántas citas corresponden al paciente
        uint contador = 0;
        for (uint i = 0; i < totalCitas; i++) {
            if (keccak256(bytes(citas[i].nombrePaciente)) == keccak256(bytes(_nombrePaciente))) {
                contador++;
            }
        }

        // Crear un array para almacenar las citas del paciente
        Cita[] memory citasPaciente = new Cita[](contador);

        // Llenar el array con las citas correspondientes
        uint index = 0;
        for (uint i = 0; i < totalCitas; i++) {
            if (keccak256(bytes(citas[i].nombrePaciente)) == keccak256(bytes(_nombrePaciente))) {
                citasPaciente[index] = citas[i];
                index++;
            }
        }

        return citasPaciente;
    }

    // Función para obtener el número total de citas
    function getNumeroDeCitas() public view returns (uint) {
        return citas.length;
    }
}
